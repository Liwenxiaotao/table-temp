<template>
  <div class="gb-form-item" :class="[{
      'gb-form-item--feedback': gbForm && gbForm.statusIcon,
      'is-error': validateState === 'error',
      'is-validating': validateState === 'validating',
      'is-success': validateState === 'success',
      'is-required': isRequired || required,
      'is-no-asterisk': gbForm && gbForm.hideRequiredAsterisk
    },
    sizeClass ? 'gb-form-item--' + sizeClass : ''
  ]">
  <!-- label ，label的宽度只由formItem或者form的labelWidth设置，label-wrap主要针对label的width是aotu时进行样式的计算-->
    <label-wrap
      :is-auto-width="labelStyle && labelStyle.width === 'auto'"
      :update-all="form.labelWidth === 'auto'">
      <label :for="labelFor" class="gb-form-item__label" :style="labelStyle" v-if="label || $slots.label">
        <slot name="label">{{label + form.labelSuffix}}</slot>
      </label>
    </label-wrap>
    <div class="gb-form-item__content" :style="contentStyle">
      <slot></slot>
      <!-- 验证的错误提示 -->
      <transition name="gb-zoom-in-top">
        <slot
          v-if="validateState === 'error' && showMessage && form.showMessage"
          name="error"
          :error="validateMessage">
          <div
            class="gb-form-item__error"
            :class="{
              'gb-form-item__error--inline': typeof inlineMessage === 'boolean'
                ? inlineMessage
                : (gbForm && gbForm.inlineMessage || false)
            }"
          >
            {{validateMessage}}
          </div>
        </slot>
      </transition>
    </div>
  </div>
</template>
<script>
  import AsyncValidator from 'async-validator';
  import emitter from '../../assets/js/mixins/emitter.js';
  import objectAssign from '../../assets/js/utils/merge.js';
  import { noop, getPropByPath } from '../../assets/js/utils/util.js';
  import LabelWrap from './label-wrap';
  export default {
    name: 'GbFormItem',

    componentName: 'GbFormItem',

    mixins: [emitter],

    provide() {
      return {
        gbFormItem: this
      };
    },

    inject: ['gbForm'],

    props: {
      label: String,
      labelWidth: String,
      prop: String,
      required: {   //  里面的表单是否必填
        type: Boolean,
        default: undefined
      },
      rules: [Object, Array],
      error: String,
      validateStatus: String,
      for: String,
      inlineMessage: {
        type: [String, Boolean],
        default: ''
      },
      showMessage: {
        type: Boolean,
        default: true
      },
      size: String
    },
    components: {
      // use this component to calculate auto width
      LabelWrap
    },
    watch: {
      error: {
        immediate: true,
        handler(value) {
          this.validateMessage = value;
          this.validateState = value ? 'error' : '';
        }
      },
      validateStatus(value) {
        this.validateState = value;
      }
    },
    computed: {
      // label的for属性
      labelFor() {
        return this.for || this.prop;
      },
      labelStyle() {   // 给label设置宽度，针对form.labelPosition是left和right，top时宽度不用设置
        const ret = {};
        if (this.form.labelPosition === 'top') return ret;
        // formItem的labelWidth的优先级比较高
        const labelWidth = this.labelWidth || this.form.labelWidth;
        if (labelWidth) {
          // 可能是固定值也可能是auto
          ret.width = labelWidth;
        }
        return ret;
      },
      /**
       * 设置content样式
       * 在form.labelPosition为left或者right时给content设置样式
       * 当formItem的labelWidth为auto时将margin-left设为label的宽度
       * 当form的labelWidth为auto时将margin-left设为所有label的最大宽度
       * 当formItem的labelWidth设为固定值时，将margin-left设为labelWidth
       */
      contentStyle() {
        const ret = {};
        const label = this.label;
        if (this.form.labelPosition === 'top' || this.form.inline) return ret;
        if (!label && !this.labelWidth && this.isNested) return ret;
        const labelWidth = this.labelWidth || this.form.labelWidth;
        if (labelWidth === 'auto') {
          if (this.labelWidth === 'auto') {
            ret.marginLeft = this.computedLabelWidth;
          } else if (this.form.labelWidth === 'auto') {
            ret.marginLeft = this.gbForm.autoLabelWidth;
          }
        } else {
          ret.marginLeft = labelWidth;
        }
        return ret;
      },
      form() {  // 获取GbForm组件实例
        let parent = this.$parent;
        let parentName = parent.$options.componentName;
        while (parentName !== 'GbForm') {
          if (parentName === 'GbFormItem') {
            this.isNested = true;
          }
          parent = parent.$parent;
          parentName = parent.$options.componentName;
        }
        return parent;
      },
      // 获取model[prop]的值
      fieldValue() {
        const model = this.form.model;
        if (!model || !this.prop) { return; }

        let path = this.prop;
        if (path.indexOf(':') !== -1) {
          path = path.replace(/:/, '.');
        }

        return getPropByPath(model, path, true).v;
      },
      // 判断是否必填
      isRequired() {
        // 已经把是否设置required属性包含进去
        let rules = this.getRules();
        let isRequired = false;

        if (rules && rules.length) {
          rules.every(rule => {
            if (rule.required) {
              isRequired = true;
              return false;
            }
            return true;
          });
        }
        return isRequired;
      },
      // 样式类型相关
      _formSize() {
        return this.gbForm.size;
      },
      gbFormItemSize() {
        return this.size || this._formSize;
      },
      sizeClass() {
        return this.gbFormItemSize || (this.$ELEMENT || {}).size;
      }
    },
    data() {
      return {
        validateState: '',  // 表单验证状态
        validateMessage: '', // 验证报错信息
        validateDisabled: false,
        validator: {},
        isNested: false,   // 是否发生gbFornItem相互嵌套
        computedLabelWidth: ''  // label计算后的宽度，用于设置margin-left
      };
    },
    methods: {
      /**
       * 验证formItem表单的值 */
      validate(trigger, callback = noop) {
        this.validateDisabled = false;
        // 获取trigger事件的验证规则
        const rules = this.getFilteredRule(trigger);
        // 没有规则的情况
        if ((!rules || rules.length === 0) && this.required === undefined) {
          callback();
          return true;
        }

        this.validateState = 'validating';

        const descriptor = {};
        if (rules && rules.length > 0) {
          rules.forEach(rule => {
            delete rule.trigger;
          });
        }
        descriptor[this.prop] = rules;
        // 创建验证器
        const validator = new AsyncValidator(descriptor);
        const model = {};

        model[this.prop] = this.fieldValue;
        // 开始验证
        validator.validate(model, { firstFields: true }, (errors, invalidFields) => {
          // 设置验证状态及验证信息
          this.validateState = !errors ? 'success' : 'error';
          this.validateMessage = errors ? errors[0].message : '';
          // 验证回调
          callback(this.validateMessage, invalidFields);
          // 触发form的validate事件，貌似form没有监听此事件
          this.gbForm && this.gbForm.$emit('validate', this.prop, !errors, this.validateMessage || null);
        });
      },
      // 清空验证状态和信息，供外部调用的方法
      clearValidate() {
        this.validateState = '';
        this.validateMessage = '';
        this.validateDisabled = false;
      },
      // 清空验证状态和信息，把表单的值设为初始值，供外部调用的方法
      resetField() {
        this.validateState = '';
        this.validateMessage = '';

        let model = this.form.model;
        let value = this.fieldValue;
        let path = this.prop;
        if (path.indexOf(':') !== -1) {
          path = path.replace(/:/, '.');
        }

        let prop = getPropByPath(model, path, true);

        this.validateDisabled = true;
        if (Array.isArray(value)) {
          prop.o[prop.k] = [].concat(this.initialValue);
        } else {
          prop.o[prop.k] = this.initialValue;
        }

        // reset validateDisabled after onFieldChange triggered
        this.$nextTick(() => {
          this.validateDisabled = false;
        });

        this.broadcast('GbTimeSelect', 'fieldReset', this.initialValue);
      },
      /**
       * 获取验证规则
       */
      getRules() {
        let formRules = this.form.rules;
        const selfRules = this.rules;
        // 如果设置required属性，手动增加一条验证的规则
        const requiredRule = this.required !== undefined ? { required: !!this.required } : [];
        // 获取设置在form上改formItem的验证规则
        const prop = getPropByPath(formRules, this.prop || '');
        formRules = formRules ? (prop.o[this.prop || ''] || prop.v) : [];
        // 设置在formItem上的rule优先级最高
        return [].concat(selfRules || formRules || []).concat(requiredRule);
      },
      /**
       * 获取触发验证的事件对应的所有验证规则
       */
      getFilteredRule(trigger) {
        // 获取该组件的验证规则
        const rules = this.getRules();
        // trigger属性设置了触发的事件，可以为array
        return rules.filter(rule => {
          // trigger为空时，返回所有验证规则
          if (!rule.trigger || trigger === '') return true;
          if (Array.isArray(rule.trigger)) {
            return rule.trigger.indexOf(trigger) > -1;
          } else {
            return rule.trigger === trigger;
          }
        }).map(rule => objectAssign({}, rule));
      },
      onFieldBlur() {
        this.validate('blur');
      },
      onFieldChange() {
        if (this.validateDisabled) {
          this.validateDisabled = false;
          return;
        }

        this.validate('change');
      },
      updateComputedLabelWidth(width) {  // labelWrap实例调用，获取label标签的宽度，
        this.computedLabelWidth = width ? `${width}px` : '';
      },
      addValidateEvents() {
        const rules = this.getRules();
        // 存在验证规则时，增加相关的监听事件
        if (rules.length || this.required !== undefined) {
          // 里面的表单触发blur或者change事件
          this.$on('gb.form.blur', this.onFieldBlur);
          this.$on('gb.form.change', this.onFieldChange);
        }
      },
      // 移除监听事件，form在rule改变时调用
      removeValidateEvents() {
        this.$off();
      }
    },
    mounted() {
      if (this.prop) {
        // 将formItem实例添加到form.fields中
        this.dispatch('GbForm', 'gb.form.addField', [this]);
        // 获取初始值
        let initialValue = this.fieldValue;
        if (Array.isArray(initialValue)) {
          initialValue = [].concat(initialValue);
        }
        // 保存初始值到formItem实例中
        Object.defineProperty(this, 'initialValue', {
          value: initialValue
        });

        this.addValidateEvents();
      }
    },
    beforeDestroy() {
      // 将实例从form.fields中移除
      this.dispatch('GbForm', 'gb.form.removeField', [this]);
    }
  };
</script>

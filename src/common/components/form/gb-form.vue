<template>
  <form class="gb-form" :class="[
    labelPosition ? 'gb-form--label-' + labelPosition : '',
    { 'gb-form--inline': inline }
  ]">
    <slot></slot>
  </form>
</template>
<script>
  import objectAssign from '../../assets/js/utils/merge.js';

  export default {
    name: 'GbForm',

    componentName: 'GbForm',

    provide() {
      return {
        gbForm: this
      };
    },

    props: {
      model: Object,
      rules: Object,
      labelPosition: String,
      labelWidth: String,
      labelSuffix: {
        type: String,
        default: ''
      },
      inline: Boolean,
      inlineMessage: Boolean,
      statusIcon: Boolean,
      showMessage: {
        type: Boolean,
        default: true
      },
      size: String,
      disabled: Boolean,
      validateOnRuleChange: {
        type: Boolean,
        default: true
      },
      hideRequiredAsterisk: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      rules() {
        // remove then add event listeners on form-item after form rules change
        this.fields.forEach(field => {
          field.removeValidateEvents();
          field.addValidateEvents();
        });
        // 规则改变触发验证
        if (this.validateOnRuleChange) {
          this.validate(() => {});
        }
      }
    },
    computed: {
      // 如果potentialLabelWidthArr里面有label宽度的值，就计算出label的最大宽度
      autoLabelWidth() {
        if (!this.potentialLabelWidthArr.length) return 0;
        const max = Math.max(...this.potentialLabelWidthArr);
        return max ? `${max}px` : '';
      }
    },
    data() {
      return {
        fields: [],  // 保存所有的formItem实例
        potentialLabelWidthArr: [] // 保存所有label的宽度
      };
    },
    created() {
      // 将formItem实例添加到fields，由formItem触发
      this.$on('gb.form.addField', (field) => {
        if (field) {
          this.fields.push(field);
        }
      });
      /* istanbul ignore next */
      // 移除某个formItem实例， 由formItem触发
      this.$on('gb.form.removeField', (field) => {
        if (field.prop) {
          this.fields.splice(this.fields.indexOf(field), 1);
        }
      });
    },
    methods: {
      // 重置表单，分别调用formItem的resetField方法
      resetFields() {
        if (!this.model) {
          console.warn('[Element Warn][Form]model is required for resetFields to work.');
          return;
        }
        this.fields.forEach(field => {
          field.resetField();
        });
      },
      // 不传参就清空所有表单的验证信息，传参就删除特定表单的验证信息，调用formItem的clearValidate方法，供外部调用
      clearValidate(props = []) {
        const fields = props.length
          ? (typeof props === 'string'
            ? this.fields.filter(field => props === field.prop)
            : this.fields.filter(field => props.indexOf(field.prop) > -1)
          ) : this.fields;
        fields.forEach(field => {
          field.clearValidate();
        });
      },
      // 验证所有表单，供外部调用
      validate(callback) {
        if (!this.model) {
          console.warn('[Element Warn][Form]model is required for validate to work!');
          return;
        }

        let promise;
        // if no callback, return promise
        if (typeof callback !== 'function' && window.Promise) {
          promise = new window.Promise((resolve, reject) => {
            callback = function(valid) {
              valid ? resolve(valid) : reject(valid);
            };
          });
        }

        let valid = true;
        let count = 0;
        // 如果需要验证的fields为空，调用验证时直接调用回调函数
        if (this.fields.length === 0 && callback) {
          callback(true);
        }
        let invalidFields = {};
        // 调用每个fornItem的验证方法
        this.fields.forEach(field => {
          field.validate('', (message, field) => {
            // message有值证明验证不通过
            if (message) {
              valid = false;
            }
            // 获取到所有验证不通过的规则
            invalidFields = objectAssign({}, invalidFields, field);
            if (typeof callback === 'function' && ++count === this.fields.length) {
              callback(valid, invalidFields);
            }
          });
        });

        if (promise) {
          return promise;
        }
      },
      // 对部分字段进行验证，供外部调用
      validateField(props, cb) {
        props = [].concat(props);
        const fields = this.fields.filter(field => props.indexOf(field.prop) !== -1);
        if (!fields.length) {
          console.warn('[Element Warn]please pass correct props!');
          return;
        }

        fields.forEach(field => {
          field.validate('', cb);
        });
      },
      // 获取label的宽度在potentialLabelWidthArr中的索引
      getLabelWidthIndex(width) {
        const index = this.potentialLabelWidthArr.indexOf(width);
        // it's impossible
        if (index === -1) {
          throw new Error('[ElementForm]unpected width ', width);
        }
        return index;
      },
      // 添加或者修改label值，在labelWrap调用
      registerLabelWidth(val, oldVal) {
        // label-wrap组件更新时对应的label的宽度也进行更新
        if (val && oldVal) {
          const index = this.getLabelWidthIndex(oldVal);
          this.potentialLabelWidthArr.splice(index, 1, val);
        } else if (val) {
          // label-wrap，mounted时将label的宽度放进potentialLabelWidthArr里面
          this.potentialLabelWidthArr.push(val);
        }
      },
      // 将label的宽度从potentialLabelWidthArr中删除，在labelWrap调用
      deregisterLabelWidth(val) {
        const index = this.getLabelWidthIndex(val);
        this.potentialLabelWidthArr.splice(index, 1);
      }
    }
  };
</script>

<style lang="scss">
  @import './form.scss'
</style>




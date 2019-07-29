<template>
  <div :class="[
    'gb-input',
    inputSize ? 'gb-input--' + inputSize : '',
    {
      'is-disabled': inputDisabled,
      'is-exceed': inputExceed,
      'gb-input--suffix': clearable
    }
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <template>
      <input
        :tabindex="tabindex"
        class="gb-input__inner"
        v-bind="$attrs"
        :type="type"
        :disabled="inputDisabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        ref="input"
        @compositionstart="handleCompositionStart"
        @compositionend="handleCompositionEnd"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        :aria-label="label"
      >
      <!-- 后置内容 -->
      <span
        class="gb-input__suffix"
        v-if="getSuffixVisible()">
        <span class="gb-input__suffix-inner">
          <i v-if="showClear"
            class="gb-input__icon gb-icon-circle-close gb-input__clear"
            @click="clear"
          ></i>
          <span v-if="isWordLimitVisible" class="gb-input__count">
            <span class="gb-input__count-inner">
              {{ textLength }}/{{ upperLimit }}
            </span>
          </span>
        </span>
      </span>
    </template>
  </div>
</template>
<script>
  import emitter from '../../assets/js/mixins/emitter.js';
  export default {
    name: 'GbInput',

    componentName: 'GbInput',

    inheritAttrs: false,  // 禁用特性继承

    inject: {
      gbForm: {
        default: ''
      },
      gbFormItem: {
        default: ''
      }
    },
    mixins: [emitter],
    data() {
      return {
        hovering: false,
        focused: false,
        isComposing: false,
      };
    },

    props: {
      value: [String, Number],
      size: String,       // 样式类型
      form: String,
      disabled: Boolean,  // 是否禁用
      readonly: Boolean,  // 是否只读
      type: {             // text
        type: String,
        default: 'text'
      },
      autocomplete: {     // 是否自动补全
        type: String,
        default: 'off'
      },
      validateEvent: {
        type: Boolean,
        default: true
      },
      label: String,
      clearable: {        // 显示清楚按钮
        type: Boolean,
        default: false
      },
      showWordLimit: {    // 限制输入字符数
        type: Boolean,
        default: false
      },
      tabindex: String
    },

    computed: {
      _elFormItemSize() { // 看form-item是否设置样式类型
        return (this.gbFormItem || {}).gbFormItemSize;
      },
      needStatusIcon() {
        return this.gbForm ? this.gbForm.statusIcon : false;
      },
      inputSize() { // 样式类型'mini,small, middle'
        return this.size || this._gbFormItemSize || (this.$ELEMENT || {}).size;
      },
      inputDisabled() {  // 是否禁用
        return this.disabled || (this.gbForm || {}).disabled;
      },
      nativeInputValue() { // 本地化value值
        return this.value === null || this.value === undefined ? '' : String(this.value);
      },
      isWordLimitVisible() {  // 是否显示字数超出指定范围时的提示语
        return this.showWordLimit &&
          this.$attrs.maxlength &&
          this.type === 'text' &&
          !this.inputDisabled &&
          !this.readonly
      },
      upperLimit() {   // 允许最大字数
        return this.$attrs.maxlength;
      },
      textLength() {  //  已输入的字数
        if (typeof this.value === 'number') {
          return String(this.value).length;
        }

        return (this.value || '').length;
      },
      inputExceed() {  // 使用字数超出范围的提示语样式
        return this.isWordLimitVisible &&
          (this.textLength > this.upperLimit);
      },
      showClear() {  // 显示清空按钮
        return this.clearable &&
          !this.inputDisabled &&
          !this.readonly &&
          this.nativeInputValue &&
          (this.focused || this.hovering);
      },
    },

    watch: {
      value(val) {
        if (this.validateEvent) {
          // 值改变时，进行验证
          this.dispatch('GbFormItem', 'gb.form.change', [val]);
        }
      },
      nativeInputValue() {
        this.setNativeInputValue();
      },
      type() {
        this.$nextTick(() => {
          this.setNativeInputValue();
          this.updateIconOffset();
        });
      }
    },

    methods: {
      // 聚焦
      focus() {
        this.getInput().focus();
      },
      // 失焦
      blur() {
        this.getInput().blur();
      },
      // 失焦时间处理函数
      handleBlur(event) {
        this.focused = false;
        this.$emit('blur', event);
        if (this.validateEvent) {
          console.log(1111)
          // 验证
          this.dispatch('GbFormItem', 'gb.form.blur', [this.value]);
        }
      },
      // 选择文本框的文字
      select() {
        this.getInput().select();
      },
      // 将input的value值设成已经本地化的值
      setNativeInputValue() {
        const input = this.getInput();
        if (!input) return;
        if (input.value === this.nativeInputValue) return;
        input.value = this.nativeInputValue;
      },
      // 聚焦时间处理函数
      handleFocus(event) {
        this.focused = true;
        this.$emit('focus', event);
      },
      // 非直接输入前触发  中文输入法
      handleCompositionStart() {
        this.isComposing = true;
      },
      // 非直接输入结束触发  中文输入法
      handleCompositionEnd(event) {
        this.isComposing = false;
        this.handleInput(event);
      },
      // input 时间处理函数
      handleInput(event) {
        // should not emit input during composition
        if (this.isComposing) return;

        // should remove the following line when we don't support IE
        if (event.target.value === this.nativeInputValue) return;
        // 主动触发input事件， 改变v-model的值
        this.$emit('input', event.target.value);

        // ensure native input value is controlled
        this.$nextTick(this.setNativeInputValue);
      },
      // change事件处理函数
      handleChange(event) {
        this.$emit('change', event.target.value);
      },
      calcIconOffset(place) {
        let elList = [].slice.call(this.$el.querySelectorAll(`.gb-input__${place}`) || []);
        if (!elList.length) return;
        let el = null;
        for (let i = 0; i < elList.length; i++) {
          if (elList[i].parentNode === this.$el) {
            el = elList[i];
            break;
          }
        }
        if (!el) return;
        const pendantMap = {
          suffix: 'append',
          prefix: 'prepend'
        };

        const pendant = pendantMap[place];
        if (this.$slots[pendant]) {
          el.style.transform = `translateX(${place === 'suffix' ? '-' : ''}${this.$el.querySelector(`.gb-input-group__${pendant}`).offsetWidth}px)`;
        } else {
          el.removeAttribute('style');
        }
      },
      updateIconOffset() {
        this.calcIconOffset('suffix');
      },
      // 获取原生input Dom
      getInput() {
        return this.$refs.input;
      },
      // 是否显示后置按钮
      getSuffixVisible() {
        return this.showClear;
      },
      clear() {  // 清空操作
        this.$emit('input', '');
        this.$emit('change', '');
        this.$emit('clear');
      },
    },

    created() {
      this.$on('inputSelect', this.select);
    },

    mounted() {
      this.setNativeInputValue();
      this.updateIconOffset();
    },

    updated() {
      this.$nextTick(this.updateIconOffset);
    }
  };
</script>


<style lang="scss">
  @import './input.scss'
</style>



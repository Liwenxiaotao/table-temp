<template>
  <button
    class="gb-button"
    @click="handleClick"
    :disabled="buttonDisabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
    :class="[
      type ? 'gb-button--' + type : '',
      buttonSize ? 'gb-button--' + buttonSize : '',
      {
        'is-disabled': buttonDisabled,
        'is-loading': loading,
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle
      }
    ]"
  >
    <i class="el-icon-loading" v-if="loading"></i>
    <i :class="icon" v-if="icon && !loading"></i>
    <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>
<script>
  export default {
    name: 'GbButton',

    inject: {
      gbForm: {
        default: ''
      },
      gbFormItem: {
        default: ''
      }
    },

    props: {
      type: {
        type: String,
        default: 'default'
      },
      size: String,
      icon: {
        type: String,
        default: ''
      },
      nativeType: {
        type: String,
        default: 'button'
      },
      loading: Boolean,
      disabled: Boolean,
      plain: Boolean,
      autofocus: Boolean,
      round: Boolean,
      circle: Boolean
    },

    computed: {
      _gbFormItemSize() {
        return (this.gbFormItem || {}).gbFormItemSize;
      },
      buttonSize() { // 按钮大小
        return this.size || this._gbFormItemSize || (this.$ELEMENT || {}).size;
      },
      buttonDisabled() {    // 是否禁用按钮
        return this.disabled || (this.gbForm || {}).disabled;
      }
    },

    methods: {
      // 点击事件，触发组件监听的click事件
      handleClick(evt) {
        this.$emit('click', evt);
      }
    }
  };
</script>
<style lang="sass">
@import './button.scss'
</style>


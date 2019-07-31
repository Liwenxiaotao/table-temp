<template>
  <label
    class="gb-radio"
    :class="[
      border && radioSize ? 'gb-radio--' + radioSize : '',
      { 'is-disabled': isDisabled },
      { 'is-focus': focus },
      { 'is-bordered': border },
      { 'is-checked': model === label }
    ]"
    role="radio"
    :aria-checked="model === label"
    :aria-disabled="isDisabled"
    :tabindex="tabIndex"
    @keydown.space.stop.prevent="model = isDisabled ? model : label"
  >
    <span class="gb-radio__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': model === label
      }"
    >
      <span class="gb-radio__inner"></span>
      <input
        ref="radio"
        class="gb-radio__original"
        :value="label"
        type="radio"
        aria-hidden="true"
        v-model="model"
        @focus="focus = true"
        @blur="focus = false"
        @change="handleChange"
        :name="name"
        :disabled="isDisabled"
        tabindex="-1"
      >
    </span>
    <span class="gb-radio__label" @keydown.stop>
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<script>
import Emitter from '../../assets/js/mixins/emitter'

export default {
  name: 'GbRadio',

  componentName: 'GbRadio',

  mixins: [Emitter],

  inject: {
    gbForm: {
      default: ''
    },

    gbFormItem: {
      default: ''
    }
  },

  props: {
    value: {},
    label: {},
    disabled: Boolean,
    name: String,
    border: Boolean,
    size: String
  },

  data () {
    return {
      focus: false
    }
  },
  computed: {
    isGroup () { // 判断是否有radio-group标签包裹
      let parent = this.$parent
      while (parent) {
        if (parent.$options.componentName !== 'GbRadioGroup') {
          parent = parent.$parent
        } else {
          this._radioGroup = parent
          return true
        }
      }
      return false
    },
    model: { // value可能绑定在radio上或者radio-group上，因此需要进行转化
      get () {
        return this.isGroup ? this._radioGroup.value : this.value
      },
      set (val) {
        if (this.isGroup) {
          // 如果v-model在radio-group，触发radio-group的input事件，给value赋值
          this.dispatch('GbRadioGroup', 'input', [val])
        } else {
          // 如果v-model在radio，触发radio的input事件，给value赋值
          this.$emit('input', val)
        }
        // 判断该radio是否被选中
        this.$refs.radio && (this.$refs.radio.checked = this.model === this.label)
      }
    },
    _gbFormItemSize () { // 样式类型结合formItem
      return (this.gbFormItem || {}).gbFormItemSize
    },
    radioSize () { // 最终需要综合radio的size属性，radio-group,formItem进行判断
      const temRadioSize = this.size || this._gbFormItemSize || (this.$ELEMENT || {}).size
      return this.isGroup
        ? this._radioGroup.radioGroupSize || temRadioSize
        : temRadioSize
    },
    isDisabled () { // 综合radio自身disabled属性，radio-group，formItem进行设置
      return this.isGroup
        ? this._radioGroup.disabled || this.disabled || (this.elForm || {}).disabled
        : this.disabled || (this.elForm || {}).disabled
    },
    tabIndex () {
      return (this.isDisabled || (this.isGroup && this.model !== this.label)) ? -1 : 0
    }
  },

  methods: {
    handleChange () {
      // 触发radio组件的change事件和radio-group的change事件
      this.$nextTick(() => {
        this.$emit('change', this.model)
        this.isGroup && this.dispatch('GbRadioGroup', 'handleChange', this.model)
      })
    }
  }
}
</script>

<style lang="sass">
@import './radio.scss'
</style>

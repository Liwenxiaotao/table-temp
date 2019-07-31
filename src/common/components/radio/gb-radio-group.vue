<template>
  <div
    class="gb-radio-group"
    role="radiogroup"
    @keydown="handleKeydown"
  >
    <slot></slot>
  </div>
</template>
<script>
import Emitter from '../../assets/js/mixins/emitter'
// 定义键码
const keyCode = Object.freeze({
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
})
export default {
  name: 'GbRadioGroup',

  componentName: 'GbRadioGroup',

  inject: {
    gbFormItem: {
      default: ''
    }
  },

  mixins: [Emitter],

  props: {
    value: {},
    size: String,
    disabled: Boolean
  },

  computed: {
    _gbFormItemSize () {
      return (this.gbFormItem || {}).gbFormItemSize
    },
    // 结合radio-group的size属性和gbFormItem判断样式类型
    radioGroupSize () {
      return this.size || this._gbFormItemSize || (this.$ELEMENT || {}).size
    }
  },

  created () {
    // 监听radio的change事件，触发绑定的radio-group上的change事件
    this.$on('handleChange', value => {
      this.$emit('change', value)
    })
  },
  mounted () {
    // 当radioGroup没有默认选项时，第一个可以选中Tab导航
    const radios = this.$el.querySelectorAll('[type=radio]')
    const firstLabel = this.$el.querySelectorAll('[role=radio]')[0]
    if (![].some.call(radios, radio => radio.checked) && firstLabel) {
      firstLabel.tabIndex = 0
    }
  },
  methods: {
    handleKeydown (e) { // 左右上下按键 可以在radio组内切换不同选项
      const target = e.target
      const className = target.nodeName === 'INPUT' ? '[type=radio]' : '[role=radio]'
      const radios = this.$el.querySelectorAll(className)
      const length = radios.length
      const index = [].indexOf.call(radios, target)
      const roleRadios = this.$el.querySelectorAll('[role=radio]')
      switch (e.keyCode) {
        case keyCode.LEFT:
        case keyCode.UP:
          e.stopPropagation()
          e.preventDefault()
          if (index === 0) {
            roleRadios[length - 1].click()
            roleRadios[length - 1].focus()
          } else {
            roleRadios[index - 1].click()
            roleRadios[index - 1].focus()
          }
          break
        case keyCode.RIGHT:
        case keyCode.DOWN:
          if (index === (length - 1)) {
            e.stopPropagation()
            e.preventDefault()
            roleRadios[0].click()
            roleRadios[0].focus()
          } else {
            roleRadios[index + 1].click()
            roleRadios[index + 1].focus()
          }
          break
        default:
          break
      }
    }
  },
  watch: {
    // 值改变时进行验证，进行验证
    value (value) {
      this.dispatch('GbFormItem', 'gb.form.change', [this.value])
    }
  }
}
</script>

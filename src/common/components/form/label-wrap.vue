<script>

export default {
  props: {
    isAutoWidth: Boolean,   // 宽度是否是auto, form-item设置或者form设置
    updateAll: Boolean      // form的labelWidth是auto，所有label的宽度都会加入计算
  },

  inject: ['gbForm', 'gbFormItem'],
  // label标签的宽度是在formItem的label标签设置的，这里主要处理labelWidth为auto的情况
  render() {
    const slots = this.$slots.default;
    if (!slots) return null;
    // 当label的labelWidth是auto时,不管是在form或者formItem上设置
    if (this.isAutoWidth) {
      // label的最大宽度
      const autoLabelWidth = this.gbForm.autoLabelWidth;
      const style = {};
      // 当form的labelWith设为auto时，给所有label的宽度较小的设置margin-left，看起来label的宽度一样大，这样可以右对齐
      if (autoLabelWidth && autoLabelWidth !== 'auto') {
        const marginLeft = parseInt(autoLabelWidth, 10) - this.computedWidth;
        if (marginLeft) {
          style.marginLeft = marginLeft + 'px';
        }
      }
      return (<div class="gb-form-item__label-wrap" style={style}>
        { slots }
      </div>);
    } else {
      // form跟formItem的labelWidth不为auto时
      return slots[0];
    }
  },

  methods: {
    getLabelWidth() {   // 获取label标签的宽度
      if (this.$el && this.$el.firstElementChild) {
        const computedWidth = window.getComputedStyle(this.$el.firstElementChild).width;
        return Math.ceil(parseFloat(computedWidth));
      } else {
        return 0;
      }
    },
    updateLabelWidth(action = 'update') {
      if (this.$slots.default && this.isAutoWidth && this.$el.firstElementChild) {
        if (action === 'update') {   // mounted时获取label的宽度
          this.computedWidth = this.getLabelWidth();
        } else if (action === 'remove') {   // 删除form.potentialLabelWidthArr中该组件label的宽度
          this.gbForm.deregisterLabelWidth(this.computedWidth);
        }
      }
    }
  },

  watch: {
    computedWidth(val, oldVal) {
      // 在form的labelWidth是auto时
      if (this.updateAll) {
        // 存进或者更新gbForm.potentialLabelWidthArr
        this.gbForm.registerLabelWidth(val, oldVal);
        // 将label标签的宽度返回给formItem，这样好设置label的宽度
        this.gbFormItem.updateComputedLabelWidth(val);
      }
    }
  },

  data() {
    return {
      computedWidth: 0   // 保存label的宽度
    };
  },

  mounted() {
    // 在form.potentialLabelWidthArr中存储该组件label的宽度
    this.updateLabelWidth('update');
  },
  // 更新form.potentialLabelWidthArr中该组件label的宽度
  updated() {
    this.updateLabelWidth('update');
  },
  // 删除form.potentialLabelWidthArr中该组件label的宽度
  beforeDestroy() {
    this.updateLabelWidth('remove');
  }
};
</script>

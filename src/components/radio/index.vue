<!--  -->
<template>
  <div>
    <gb-form ref="form" :model="ruleForm" :rules="rules">
      <gb-form-item label="特殊资源" prop="resource">
        <gb-radio-group v-model="ruleForm.resource" @change="clickHandle">
          <gb-radio label="1">一</gb-radio>
          <gb-radio label="2">二</gb-radio>
          <gb-radio label="3" disabled border>三</gb-radio>
        </gb-radio-group>
      </gb-form-item>
      <gb-form-item>
        <gb-button @click="clickHandle">提交</gb-button>
      </gb-form-item>
    </gb-form>
  </div>
</template>

<script>
import gbRadio from 'components/radio/gb-radio.vue'
import gbRadioGroup from 'components/radio/gb-radio-group.vue'
import gbForm from 'components/form/gb-form.vue'
import gbFormItem from 'components/form/gb-form-item.vue'
import gbButton from 'components/button/gb-button.vue'

export default {
  data () {
    console.log(1111)
    var validate = (rule, value, callback) => {
      if (value === '1') {
        callback(new Error('不能选1'));
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        resource: '1'
      },
      rules: {
        resource: [{ validator: validate, trigger: 'change' }]
      }
    }
  },
  created () {},
  components: {
    gbRadio,
    gbRadioGroup,
    gbForm,
    gbFormItem,
    gbButton
  },
  watch: {},
  computed: {},
  mounted () {},
  methods: {
    clickHandle () {
      console.log(this.ruleForm.resource)
    }
  }
}

</script>

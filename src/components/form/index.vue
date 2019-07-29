<template>
  <div>
    <gb-form
      ref="form"
      :model="form"
      :rules="rules"
      label-position="right"
      label-width="auto"
      label-suffix=":"
      validate-on-rule-change
      @validate="validateEvent">
      <gb-form-item
        prop="name"
        label="姓名"
        error="1111">
        <gb-input
        id="name"
        v-model="form.name">
        </gb-input>
      </gb-form-item>
      <gb-form-item
        prop="email"
        label="邮箱"
        :rules="[
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]"
        label-width="200px">
        <gb-input
          v-model="form.email">
        </gb-input>
      </gb-form-item>
    </gb-form>
    <el-button type="primary" @click="submitForm">提交</el-button>
    <el-button type="primary" @click="validateMail">验证邮箱</el-button>
    <el-button type="primary" @click="resetFields">重置</el-button>
    <el-button type="primary" @click="clear">清空验证信息</el-button>
  </div>
</template>

<script>
import gbForm from '../../common/components/form/gb-form'
import gbFormItem from '../../common/components/form/gb-form-item'
import gbInput from '../../common/components/input/gb-input'

export default {
  data() {
    return {
      form: {
        name: 'aa',
        age: '',
        email: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
    }
  },
  //  mounted() {
  //   this.rules = {
  //     name: [
  //       { required: true, message: '请输入活动名称啊', trigger: 'blur' },
  //     ]
  //   }
  // },
  components: {
    gbForm,
    gbFormItem,
    gbInput
  },
  methods: {
    submitForm() {
      this.$refs.form.validate((valid, fields) => {
        console.log(valid, fields);
      });
    },
    validateMail() {
      this.$refs.form.validateField(["email"], (valid, fields) => {
        console.log(valid, fields);
      });
    },
    resetFields() {
       this.$refs.form.resetFields();
    },
    clear() {
      this.$refs.form.clearValidate();
    },
    //  在formItem触发
    validateEvent() {
      console.log(11111)
    }
  }
}
</script>

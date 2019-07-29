<!--  -->
<template>
  <div>
    <gb-button-group>
      <gb-button type="success" round icon="el-icon-edit" disabled>小小按钮</gb-button>
      <gb-button type="success" :loading="true">小小按钮 <i class="el-icon-upload el-icon--right"></i></gb-button>
    </gb-button-group>
    <gb-button-group>
      <gb-button type="primary" icon="el-icon-arrow-left">上一页</gb-button>
      <gb-button type="primary">下一页<i class="el-icon-arrow-right el-icon--right"></i></gb-button>
    </gb-button-group>
    <gb-button type="text" >小小按钮</gb-button>
    <el-button type="danger" icon="el-icon-delete" circle></el-button>
  </div>
</template>

<script>
import gbButton from 'components/button/gb-button'
import gbButtonGroup from 'components/button/gb-button-group'
export default {
  data() {
    return {
    }
  },
  created() {},
  components: {
    gbButton,
    gbButtonGroup
  },
  watch: {},
  computed: {},
  mounted() {},
  methods: {}
}

</script>
<style scoped>
</style>


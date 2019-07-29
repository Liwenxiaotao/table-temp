<!--  -->
<template>
  <div>
    <gb-input
      v-model="message"
      :maxlength="10"
      :show-word-limit = "true"
      placeholder="请输入"
      :clearable="true"
      autocomplete="on"
      @blur="blur"
      @focus="focus"
      @change="change"
      @clear="clear"
      @input="input"
      ref="input"
      style="width: 500px">
      </gb-input>
  </div>
</template>

<script>
import gbInput from 'components/input/gb-input.vue';

export default {
  data() {
    return {
      message: ''
    }
  },
  created() {},
  components: {
    gbInput,
  },
  watch: {},
  computed: {},
  mounted() {},
  methods: {
    blur(e) {
      console.log('blur' + e)
    },
    focus(e) {
      console.log('focus' + e)
    },
    change(e) {
      console.log('change' + e)
    },
    clear() {
      console.log('clear')
    },
    input(value) {
      console.log('input' + value)
    }
  }
}

</script>
<style scoped>
</style>



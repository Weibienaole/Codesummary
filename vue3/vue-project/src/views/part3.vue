<template>
  <div class='part3Container'>
    <input type="text" v-focus>
  </div>
</template>

<script>
export default {
  directives: {
    focus: {
      mounted (el) {
        el.focus()
      }
    }
  },
  setup(props, ctx){

  },
  mounted(){
    console.log(this.$el);
  }
}
</script>
<style lang='less' scoped>

</style>
<template>
  <div class=''>
    <div>选项式API com2</div>
    <span class="data">{{ a }}/{{ count.c }}</span>

    <div @click="num.a++">{{ num.a }}</div>

    <div @click="obj.as.value++">obj see {{ obj.as }}</div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue';

export default {
  setup (props, { expose }) {
    const count = reactive({ cs: 1 })
    const num = ref({ a: 2 })
    const obj = { as: ref(2) }
    expose({ count })
    return {
      count,
      num,
      obj
    }
  },
  data () {
    return {
      a: 1
    }
  },
  mounted () {
    console.log(this.count, 'this');
  }
}
</script>
<style lang='less' scoped>

</style>
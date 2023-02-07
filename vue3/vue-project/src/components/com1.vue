<script setup>
import { onMounted, ref, useSlots, watch } from 'vue';
const num = ref({ a: 2 })
const props = defineProps({
  data: {
    type: Object,
    default: () => ({ a: 1 })
  }
})

const emits = defineEmits(['info', 'getData'])


onMounted(() => {
})

const info = () => {
  emits('info', 1)
}
const getData = () => {
  emits('getData', props.data)
}

defineExpose({
  data: 'a im zzy'
})

const renderSets = () => {
  // return (
  //   <div>
  //     {data.a === 1 ? <div>set 1</div> : <span>set 2</span>}
  //   </div>
  // )
}

watch('num', (e) => {
  console.log(e, 'eee')
})
</script>
<template>
  <div class="com1">
    i am con1 componrnt props: {{ data }}

    <div @click="info">get info</div>
    <div @click="getData">data get</div>
    <slot name="Aa" :propsData="data"></slot>
    <br>
    <slot name="Bb"></slot>
    {{ renderSets() }}
  </div>
  <div v-lock="123">content</div>

  <div @click="num.a++">click num box {{ num }}</div>
</template>

<style scoped lang='less'>

</style>
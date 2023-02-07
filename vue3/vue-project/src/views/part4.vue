<script setup>
import { nextTick, reactive, ref } from 'vue';

// console.log(1);
// setTimeout(() => {
//   console.log(2);
// }, 0);

// nextTick(() => {
//   console.log(4);
// })
// console.log(3);

let arr1 = ref([1,1])

const handleConcatAdd = () => {
  arr1.value = [...arr1.value, ...[3, 3]]
  console.log(arr1.value, 'arr1');
}
</script>

<template>
  <div @click="arr1.push(2)">click push add</div>
  <div @click="handleConcatAdd">click concat add</div>
  <div>{{ arr1 }}</div>
  <div v-for="(item, index) in arr1" :key="index">
    {{ item }}
  </div>
</template>

<style scoped lang='less'>

</style>
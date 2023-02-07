<script setup>
import { inject, onMounted, ref } from 'vue'
import {useRouter} from 'vue-router'
import Com1 from '../components/com1.vue';
import Com2 from '../components/com2.vue';

const com1Ref = ref()
const com2Ref = ref()

const dataA = ref(11)

const router = useRouter()

onMounted((props, context) => {
  // console.log(props, context, 'setup');
  // console.log(com1Ref.value);
  console.log(com2Ref.value.count, 'com2Ref');
})

const getInfo = (...args) => {
  console.log('info', args);
}

const getData = (...args) => {
  console.log('getData', args);
}

const theme = inject('theme')

const jump = () => {
  router.push('/part2')
}
</script>

<template>

  <div class="aas">i am Arhtas</div>
  <Com1 ref="com1Ref" :data="{ a: 3 }" @info="getInfo" @getData="getData">
    <template #Aa="{ propsData }">
      i am children of father my name's Aa data=={{ dataA }} fatherData--{{ propsData }}
    </template>
    <template #Bb>
      i am children of father my name's Bb
    </template>
  </Com1>

  <Com2 ref="com2Ref" />

  now theme: {{ theme }}

  <div @click="jump">to part 2</div>
</template>

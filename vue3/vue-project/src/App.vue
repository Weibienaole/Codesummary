<script setup>
import { provide, ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router'

const refA = ref(1)
provide('appValPro', refA)
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/part1">part1</RouterLink>
        <br>
        <RouterLink to="/part2">组合式API-part2</RouterLink>
        <br>
        <RouterLink to="/part3">选项式API-part3</RouterLink>
        <br>
        <RouterLink to="/part4">part4-part4</RouterLink>
      </nav>
    </div>
    <span @click="refA++">click Add refA num: {{refA}}</span>
    <p>router-view container:</p>
   <RouterView/>
  </header>

</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}
</style>

<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { defineAsyncComponent } from 'vue'
import App from 'remote_app/App'
import { setNum } from 'remote_app/utils'
// 3. 异步组件
const AysncRemoteButton = defineAsyncComponent(() =>
  import('remote_app/Button')
)
console.log(setNum(1212))
</script>

<template>
  <div>
    <img alt="Vue logo" src="./assets/logo.png" />
    <AysncRemoteButton />
    <App />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

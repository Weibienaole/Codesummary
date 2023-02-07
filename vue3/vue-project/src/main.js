import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

app.use(router)

app.mount('#app')

app.provide('theme', 'red')

app.directive('lock', (el, binding) => {
  // console.log(el, binding, 'sLock')
})

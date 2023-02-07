<script setup>
import { ref, watchEffect, computed, reactive, watch, toRef, customRef, toRaw, onMounted, onUpdated, inject } from 'vue'
const watchA = ref(1)
const watchB = ref(2)
const watchC = ref(0)
const watchD = computed(() => watchA.value + watchB.value, {
  // 第二个参数分别对应触发，修改 便于调试，watchEffect同样支持
  onTrack (e) {
    // debugger
  },
  onTrigger (e) {
    // debugger
  }
})
onMounted(() => {
  watchEffect(() => {
    watchC.value = watchA.value + watchB.value
    document.querySelector('#addC').innerHTML = `响应式副作用 C：${watchC.value} 一般用于更新DOM`
  })
})

const addWatch = (t) => {
  if (t === 'a') {
    watchA.value++
  } else {
    watchB.value++
  }
}

const watchE = ref(0)
const watchF = reactive({ target: 1 })

watch([watchE, watchF], (n, o) => {
  // console.log('new:', n, 'old:', o);
  document.querySelector('#anwser').innerHTML = n[0] + n[1].target
},
  { immediate: false }
)

const handleToRefAdd = (target) => {
  target.value++
}

const useDebounceRef = (value, delay = 2000) => {
  let timer
  return customRef((tarck, tirgger) => {
    return {
      get () {
        tarck()
        return value
      },
      set (newValue) {
        clearTimeout(timer)
        timer = setTimeout(() => {
          value = newValue
          tirgger()
        }, delay);
      }
    }
  })
}
const inpDebounceVal = useDebounceRef('12', 300)

onUpdated(() => {
  console.log('dom upadte log');
})

const appRefA = inject('appValPro')
</script>

<template>
  <div>
    <span id="addC"></span>
    <br>
    <span @click="addWatch('a')">click A++ {{ watchA }}</span>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <span @click="addWatch('b')">click B++ {{ watchB }}</span>
    <br>
    计算属性D: {{ watchD }} A + B
    <br>
    watch: <span id="anwser"></span><span @click="--watchF.target">watchF--</span>
    <br>
    <p>toRef</p>
    <p><span @click="handleToRefAdd(toRef(watchF, 'target'))">add to toRefF</span> watchF: {{ watchF.target }}</p>
    <p>custom: input-debounce</p>
    <input type="text" v-model="inpDebounceVal">
    {{ inpDebounceVal }}
    <p>inject</p>
    {{ appRefA }}
    <p><span @click="appRefA--">minus appRefA num</span></p>
  </div>
</template>

<style scoped lang='less'>

</style>
// import as from './src/a'
function sum(a: number, b: number): number {
  return a + b
}
function po() {
  return new Promise((resolve: any) => {
    setTimeout(() => {
      resolve('a')
    }, 1000)
  })
}
po().then((res) => console.log(res))

// console.log(sum(1, 2), as)

console.log(...new Set([1,1,2,2,3,4,2,1,2]), 'set');

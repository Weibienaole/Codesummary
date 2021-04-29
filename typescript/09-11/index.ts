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

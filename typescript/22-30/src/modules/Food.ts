import Snake from './Snake'
class Food {
  el: HTMLElement
  snake: Snake = new Snake()
  constructor() {
    // el可能为null，添加 ! 告诉ts此值永远都不为null，来取消报错
    this.el = document.querySelector('.container .food')!
    this.change()
  }
  get X() {
    return this.el.offsetLeft
  }
  get Y() {
    return this.el.offsetTop
  }
  change(): void {
    const left = Math.floor(Math.random() * 29) * 10
    const top = Math.floor(Math.random() * 29) * 10

    console.log(left, top, this.snake.snakeMove)
    // 避免重合
    if (this.snake.snakeMove.some((it) => it[0] === left && it[1] === top)) return this.change()
    this.el.style.left = left + 'px'
    this.el.style.top = top + 'px'
  }
}
export default Food

export default class Snake {
  el: HTMLElement
  head: HTMLElement
  elChildrens: HTMLCollection
  snakeMove = [[0, 0]]

  constructor() {
    // 使用 类型断言 来处理报错
    this.el = document.querySelector('.activeArea .snake') as HTMLElement
    this.head = document.querySelector('.activeArea .snake div') as HTMLElement
    this.elChildrens = this.el.getElementsByTagName('div')
  }
  set X(val) {
    if (val > 290 || val < 0) throw Error()
    this.head.style.left = val + 'px'
  }
  get X() {
    return this.head.offsetLeft
  }
  set Y(val) {
    if (val > 290 || val < 0) throw Error()
    this.head.style.top = val + 'px'
  }
  get Y() {
    return this.head.offsetTop
  }
  addBodys() {
    // 在指定el中追加元素
    this.el.insertAdjacentHTML('beforeend', '<div class="snakeBlock"></div>')
  }
  moveBodys() {
    for (let i = this.elChildrens.length - 1; i > 0; i--) {
      let X = (this.elChildrens[i - 1] as HTMLElement).offsetLeft
      let Y = (this.elChildrens[i - 1] as HTMLElement).offsetTop

      ;(this.elChildrens[i] as HTMLElement).style.left = X + 'px'
      ;(this.elChildrens[i] as HTMLElement).style.top = Y + 'px'
      this.snakeMove[i] = [X, Y]
    }
  }
  isCollision(X: number, Y: number): boolean {
    let noHeadArr = [...this.snakeMove]
    noHeadArr.shift()
    return noHeadArr.some((it) => it[0] == X && it[1] == Y)
  }
}

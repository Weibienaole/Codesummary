import Food from './Food'
import Snake from './Snake'
import ScorePanel from './ScorePanel'

let timer
export default class GameControl {
  food: Food
  snake: Snake
  scorePanel: ScorePanel

  direction: string = ''
  isAlive: boolean = true
  constructor() {
    this.food = new Food()
    this.snake = new Snake()
    this.scorePanel = new ScorePanel()
  }
  init() {
    // 监听时间内使用this,导致this指向document(由于是document所引用) 使用bind绑定this，使之正确指向  GameControl 类
    document.addEventListener('keydown', this.ketDown.bind(this))
    this.isAlive &&
      (timer = setInterval(
        this.run.bind(this),
        100 - (this.scorePanel.level - 1) * 20
      ))
  }
  ketDown(e: KeyboardEvent) {
    // 获取方向
    this.direction = e.key
  }
  run() {
    if (!this.isAlive || !this.direction) return
    let X = this.snake.X,
      Y = this.snake.Y
    switch (this.direction) {
      case 'ArrowUp':
      case 'Up':
        Y -= 10
        break
      case 'ArrowDown':
      case 'Down':
        Y += 10
        break
      case 'ArrowLeft':
      case 'Left':
        X -= 10
        break
      case 'ArrowRight':
      case 'Right':
        X += 10
        break
    }

    this.isEating(X, Y)

    // 在赋值之前将头部以外的盒子进行重新赋值
    this.snake.moveBodys()
    try {
      this.snake.X = X
      this.snake.Y = Y
    } catch {
      this.gameOver()
    }
    this.snake.snakeMove[0] = [X, Y]
    if(this.snake.isCollision(X, Y))return this.gameOver()
  }
  isEating(X: number, Y: number) {
    if (X === this.food.X && Y === this.food.Y) {
      this.food.change()
      
      this.scorePanel.addScore()
      this.snake.addBodys()
    }
  }
  gameOver() {
    alert('GAME OVER!!!')
    timer = null
    this.direction = ''
  }
}

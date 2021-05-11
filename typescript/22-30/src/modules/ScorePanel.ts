export default class ScorePanel {
  score: number = 0
  level: number = 1

  scoreEl: HTMLElement
  levelEl: HTMLElement

  maxLevel: number
  levelUpNum: number
  constructor(maxLevel: number = 10,levelUpNum: number = 10) {
    this.scoreEl = document.querySelector('.scorePanel .score')!
    this.levelEl = document.querySelector('.scorePanel .level')!
    this.maxLevel = maxLevel
    this.levelUpNum = levelUpNum
  }
  addScore() {
    // innerHTML 接受 string 所以需要将 number 转换成 string
    this.scoreEl.innerHTML = ++this.score + ''
    if(this.score % this.levelUpNum === 0) this.addLevel()
  }
  addLevel() {
    if (this.level >= this.maxLevel) return
    this.levelEl.innerHTML = ++this.level + ''
  }
}


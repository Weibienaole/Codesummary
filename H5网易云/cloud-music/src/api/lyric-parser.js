// 解析 [00:01.997] 这一类时间戳的正则表达式
const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g

const STATE_PAUSE = 0
const STATE_PLAYING = 1

export default class Lyric {
  /**
   * @params {string} lrc 歌词字符串
   * @params {function} handler 回调
   * @params {number} speed 倍速
  */
  constructor(lrc = '', handler = () => { }, speed = 1) {
    this.lrc = lrc
    this.handler = handler
    this.lines = [] // 解析后的数组
    this.state = STATE_PAUSE // 播放状态
    this.curLineIndex = 0 // 当前选中歌词
    this.startStamp = 0 // 当前时间戳
    this.speed = speed // 播放速率
    this._initLines()
  }
  // 初始化解析歌词
  _initLines() {
    const lines = this.lrc.split('\n')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      let result = timeExp.exec(line)
      if (!result) continue;
      const txt = line.replace(timeExp, '').trim()
      if (txt) {
        if (result[3].length === 3) {
          result[3] = result[3] / 10;//[00:01.997] 中匹配到的 997 就会被切成 99
        }
        this.lines.push({
          time: result[1] * 60 * 1000 + result[2] * 1000 + (result[3] || 0) * 10,// 转化具体到毫秒的时间，result [3] * 10 可理解为 (result / 100) * 1000
          txt
        })
      }
    }
    this.lines.sort((a, b) => a.time - b.time)
  }
  /**
   * 
   * @param {number} offset : 时间进度;
   * @param {boolean} isSeek : 是否为用户手调进度
   */
  play(offset = 0, isSeek = false) {
    if (!this.lines.length) return
    this.state = STATE_PLAYING
    // 找到当前所在行
    this.curLineIndex = this._findCurLineIndex(offset)
    // 现在处于 this.curLineIndex - 1,将歌词传递出去
    this._callHandle(this.curLineIndex - 1)
    // 获取到歌曲开始播放的时间 当前时间 - 已播放长度
    this.startStamp = +new Date() - offset
    if (this.curLineIndex < this.lines.length) {
      clearTimeout(this.timer)
      // 继续播放
      this.playRest(isSeek)
    }
  }
  // 继续播放，isSeek和play的isSeek一致
  playRest(isSeek = false) {
    const line = this.lines[this.curLineIndex]
    let delay;
    if (isSeek) {
      // 距离下一行播放的时间间隔 = 在整首歌内下一行的时间长 - (当前时间 - 歌曲播放时间)
      delay = line.time - (+new Date() - this.startStamp)
    } else {
      // 从上一行时间戳开始计算到下一行的间隔
      let preTime = this.lines[this.curLineIndex - 1] ? this.lines[this.curLineIndex - 1].time : 0
      delay = line.time - preTime
    }
    // 延迟一定的时间之后转至下一行歌词
    this.timer = setTimeout(() => {
      this._callHandle(this.curLineIndex++)
      if (this.curLineIndex < this.lines.length && this.state === STATE_PLAYING) {
        this.playRest()
      }
      // 除以倍速获取正确的歌词
    }, delay / this.speed)
  }
  // 播放暂停控制器
  togglePlay(offset) {
    if (this.state === STATE_PLAYING) {
      this.stop()
    } else {
      this.state = STATE_PLAYING
      this.play(offset, true)
    }
  }
  stop() {
    this.state = STATE_PAUSE
    // 清理timer，结束换行
    clearTimeout(this.timer)
  }
  // 手调进度，传入调整的长度以及 isSeek为true即可
  seek(offset) {
    this.play(offset, true)
  }
  changeSpeed(speed) {
    this.speed = speed
  }
  _findCurLineIndex(time) {
    for (let i = 0; i < this.lines.length; i++) {
      // for 找到最后一个符合判断的 i 返回，反之返回len - 1
      if (time <= this.lines[i].time) {
        return i
      }
    }
    return this.lines.length - 1
  }
  _callHandle(i) {
    if (i < 0) return
    // console.log(i);
    this.handler({ txt: this.lines[i].txt, lineNum: i })
  }

}
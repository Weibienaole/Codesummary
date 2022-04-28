import axios from 'axios'
import { Toast } from 'antd-mobile'
import { isEmptyObject } from 'zzy-javascript-devtools'
/**
 * url - 接口名称
 * data - 数据组
 * token - 用户信息
 * type - 域名类型(区分多个不同的域名)
 */

type IRequestObj = (url: string, data?: object) => Promise<object>

interface IAxiosReturnD {
  status: number
  data: object
  statusText: string
  [key: string]: any
}

const request: IRequestObj = (url, data = {}) => {
  Toast.loading('加载中...', 30, () => {
    Toast.hide()
    Toast.fail('加载失败，请重试', 2)
    return
  })
  let u: string = `http://192.168.50.32:8848/${url}`
  if (!isEmptyObject(data)) {
    let str = ''
    for (let i in data) {
      str += `${i}=${data[i]}&`
    }
    u = `${u}?${str.substring(0, str.length - 1)}`
  }
  return new Promise((reslove, reject): void => {
    axios
      .get(u)
      .then(function (res: IAxiosReturnD) {
        if (res.status === 200) {
          // Toast.hide()
          reslove(res.data)
        } else {
          Toast.hide()
          Toast.offline(res.statusText, 5)
          reject(res)
        }
      })
      .catch(function (err) {
        Toast.hide()
        Toast.fail(err.msg || '加载失败，请重试', 5)
        reject(err)
      })
  })
}
export default request

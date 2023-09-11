/**
 *
 * @param {String} txt  显示文案
 * @param {Number} time  loading超时时间 s
 * @param {Number} id  loading唯一id
 * @param {Number} delay  延迟多少ms后显示
 * @param {Function} cb  超时后调用的回调
 *
 */
const svg = `<svg
t="1658826336161"
className="icon"
viewBox="0 0 1024 1024"
version="1.1"
xmlns="http://www.w3.org/2000/svg"
p-id="8845"
width="32"
height="32"
class="icon"
>
<path
  d="M204.8 204.8m-204.8 0a204.8 204.8 0 1 0 409.6 0 204.8 204.8 0 1 0-409.6 0Z"
  fill="#EBF2FC"
  p-id="8846"
></path>
<path
  d="M819.2 204.8m-204.8 0a204.8 204.8 0 1 0 409.6 0 204.8 204.8 0 1 0-409.6 0Z"
  fill="#B5D2F3"
  p-id="8847"
></path>
<path
  d="M819.2 819.2m-204.8 0a204.8 204.8 0 1 0 409.6 0 204.8 204.8 0 1 0-409.6 0Z"
  fill="#7FB0EA"
  p-id="8848"
></path>
<path
  d="M204.8 819.2m-204.8 0a204.8 204.8 0 1 0 409.6 0 204.8 204.8 0 1 0-409.6 0Z"
  fill="#4A90E2"
  p-id="8849"
></path>
</svg>`

let ids = []

interface IProps {
	txt?: string
	time?: number
	id?: number | string
	delay?: number
	cb?: () => void
}

const selfLoading = (props: IProps) => {
	const { txt = '加载中...', time = 30, id = null, delay = 0, cb } = props
	const loadDom = document.createElement('div')
	loadDom.setAttribute('id', `LoadingComponentId_${id}`)
	loadDom.setAttribute('class', 'Loading-Component_Container')
	const childDom = document.createElement('div')
	childDom.className = 'content'
	const childHTML = `
    ${svg}
    <span>${txt}</span>
  `
	childDom.innerHTML = childHTML
	loadDom.appendChild(childDom)
	if (delay) {
		const delayTimer = setTimeout(() => {
			insert(loadDom, time, cb)
			clearTimeout(delayTimer)
		}, delay)
		ids.push({ id, delay, delayTimer })
	} else {
		ids.push({ id, delay })
		insert(loadDom, time, cb)
	}
}

const insert = (dom, time, cb) => {
	document.body.appendChild(dom)
	const timeoutTimer = setTimeout(() => {
		selfHideLoading()
		cb && cb()
		clearTimeout(timeoutTimer)
	}, time * 1000)
}

const selfHideLoading = (loadId?: number) => {
	try {
		let targetDom
		if (loadId) {
			targetDom = document.getElementById(`LoadingComponentId_${loadId}`)
			const idx = ids.findIndex((item) => item.id === loadId)
			if (targetDom) {
				document.body.removeChild(targetDom)
			} else {
				const findThis = ids[idx]
				// 没有目标id的dom，且有延迟timer id 进行清除
				if (findThis && findThis.delay) {
					clearTimeout(findThis.delayTimer)
				} else if (!ids.length) {
					// 异常情况，loadId没有加入到ids中，进行全部清除
					selfHideLoading()
				}
			}
			if (idx !== -1) {
				ids.splice(idx, 1)
			}
		} else {
			targetDom = document.querySelectorAll('.Loading-Component_Container')
			// console.log(targetDom, 'targetDom')
			// 没有对应id，就是错误请求返回途径的 hideloading 清除所有存在的loading
			if (targetDom.length) {
				for (let i = 0; i < targetDom.length; i++) {
					document.body.removeChild(targetDom[i])
				}
			}
			ids = []
		}
	} catch (e) {
		console.warn('loading component err:', e)
	}
}

export { selfLoading, selfHideLoading }

// 深拷贝
export function deepClone(target: any): any {
	let result
	if (typeof target === 'object') {
		if (Array.isArray(target)) {
			result = []
			for (const i in target) {
				result.push(deepClone(target[i]))
			}
		} else if (target === null) {
			result = null
		} else if (target.constructor === RegExp) {
			result = target
		} else {
			result = {}
			for (const i in target) {
				;(result[i] as unknown) = deepClone(target[i])
			}
		}
	} else {
		result = target
	}
	return result
}

// 重定向至登录页，并携带前地址信息
export const rewriteUrlInLogin = () => {
	const hashUrl = window.location.hash.slice(1)
	let suffix = ''
	if (hashUrl && hashUrl !== '/') {
		suffix = '?rewrite=' + encodeURIComponent(hashUrl)
	}
	window.location.replace(`#/login${suffix}`)
}

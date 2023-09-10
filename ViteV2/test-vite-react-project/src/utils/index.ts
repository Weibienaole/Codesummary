import { useOutlet } from 'react-router-dom'
export const useCreateOutletEl = () => {
	const outlet = useOutlet()
	return outlet
}
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

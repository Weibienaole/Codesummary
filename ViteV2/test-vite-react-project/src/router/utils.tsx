import { lazy } from '@loadable/component'
import { RouteObject } from 'react-router-dom'
import { IRawRouter } from '@/types'

// 规范化key 不允许存在 /
export const normalizedKey = (key: string) => {
	if (key.startsWith('/')) {
		return key.slice(1)
	}
	return key
}

// 生成路由
export const generateRouters = (
	raw: IRawRouter[] = [],
	filterRoutes: RouteObject[] = [],
	paths: string[] = []
) => {
	for (let index = 0; index < raw.length; index++) {
		const rawRoute = raw[index]
		const hasChildren = (rawRoute.children as IRawRouter[])?.length > 0
		if (!rawRoute.nest && hasChildren) {
			// 不是嵌套路由，只是上下级
			;(raw[index].children as IRawRouter[]).unshift({
				index: true,
				module: rawRoute.module,
				params: rawRoute.params
			})
			delete raw[index].module
			delete raw[index].params
		}

		const currentPaths = [...paths]
		if (rawRoute.key) {
			if (currentPaths.length === 0) {
				currentPaths.push('/' + normalizedKey(rawRoute.key))
			} else {
				currentPaths.push(normalizedKey(rawRoute.key))
			}
		}

		const Element = lazy(rawRoute.module) as any

		filterRoutes.push({
			...rawRoute,
			path: currentPaths.join('/'),
			element: rawRoute.module ? (
				<Element routeParams={rawRoute.params} />
			) : null,
			children: rawRoute.children
				? generateRouters(rawRoute.children, [], currentPaths)
				: null
		} as RouteObject)
	}
	return filterRoutes
}

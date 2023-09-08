import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ReactNode, Suspense } from 'react'
import loadable, { lazy } from '@loadable/component'

import './App.css'

import ErrorBoundary from './components/ErrorBoundary'

interface IRawRouter {
	path: string
	module?: string
	element?: ReactNode
	index?: boolean
	children?: IRawRouter[]
}

/*
	rules:
	每一层 默认进入的route设定为 index
	嵌套路由 --- 子集有Route 且当前有element
	子集路由 --- 子集有Route  二者可合并，但是嵌套路由需要在子集页面额外加 Outlet
	
	routes = [
		path: string,
		module: string,
		default: '/' | string, --- 一级为 / 二级string类型 ---- 待定
		childrens: [
			...routes
		]
	]
*/

const rawRoutes = [
	{
		path: '/',
		module: './views/home',
		index: true
	},
	{
		path: '/docs',
		module: './views/docs',
		children: [
			{
				path: '/docs/child',
				module: './views/docs/child',
				index: true
			},
			{
				path: '/docs/child2',
				module: './views/docs/child/child2',
				children: [
					{
						path: '/docs/child2/child',
						module: './views/docs/child/child3'
						//index: true
					}
				]
			}
		]
	},
	{
		path: '/add',
		module: './views/add'
		// 如果子集路由如何生成？
		// children: [
		//	{
		//		path: '/detail',
		//		children: [
		//			{
		//				path: '/detail/:id',
		//				module: './views/add/detail'
		//			}
		//		]
		//	}
		//]
	},
	{
		path: '/cos',
		module: './views/docs',
		children: [
			{
				path: '/cos/child',
				module: './views/docs',
				index: true
			}
		]
	},
	{
		path: '/404',
		module: './views/404'
	}
]

const generateRouters = (raw: IRawRouter[] = []) => {
	return raw.map((rawRoute) => {
		const Dynamic = lazy(
			(p: { modulePath: string }) => import(`./${p.modulePath}`),
			{
				cacheKey: (p: { modulePath: string }) => p.modulePath
			}
		)

		const o = {} as IRawRouter
		if (rawRoute.children) {
			o.children = generateRouters(rawRoute.children)
		}
		if (rawRoute.module) {
			o.element = (
				<Dynamic modulePath={rawRoute.module} index={rawRoute.index || false} />
			)
		}
		delete rawRoute.module
		return {
			...rawRoute,
			...o
		}
	})
}

const App = () => {
	const router = generateRouters(rawRoutes)

	return (
		<>
			{/*<ErrorBoundary
				mode={import.meta.env.MODE as 'development' | 'production'}
			>*/}
			<Suspense fallback={<span style={{ color: '#fff' }}>loading...</span>}>
				<RouterProvider router={createBrowserRouter(router)} />
			</Suspense>
			{/*</ErrorBoundary>*/}
		</>
	)
}

export default App

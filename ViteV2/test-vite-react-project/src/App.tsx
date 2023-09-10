import { Suspense, useLayoutEffect, useState } from 'react'
import { RouteObject, RouterProvider, createHashRouter } from 'react-router-dom'

import './App.css'
import { baseRoute, staticRoutes } from './router'
import { deepClone } from './utils'
import GlobalStyle from './style'

const App = () => {
	const [routes, setRoutes] = useState(baseRoute)
	useLayoutEffect(() => {
		// 鉴权结束后，router为筛选后的可用路由，随后在baseRouter内进行赋值
		setFilterRoutes('/', staticRoutes)
	}, [])

	const setFilterRoutes = (base: string, routes: RouteObject[]) => {
		const findIndex = baseRoute.findIndex((r) => r.path === base)
		const cloneRoutes = deepClone(baseRoute)
		if (findIndex >= 0) {
			cloneRoutes[findIndex].children = routes
		}
		setRoutes(cloneRoutes)
		console.log(cloneRoutes, 'cloneRoutes')
	}

	return (
		<>
			{/*<ErrorBoundary
				mode={import.meta.env.MODE as 'development' | 'production'}
			>*/}
			<Suspense fallback={<span style={{ color: '#fff' }}>loading...</span>}>
				<GlobalStyle />
				<RouterProvider router={createHashRouter(routes)} />
			</Suspense>
			{/*</ErrorBoundary>*/}
		</>
	)
}

export default App

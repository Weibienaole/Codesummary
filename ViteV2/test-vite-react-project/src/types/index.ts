// import { ReactNode } from 'react'

export interface IRawRouter {
	key?: string
	module?: any
	index?: boolean
	nest?: boolean
	params?: IRawRouteParams
	children?: IRawRouter[]
}

export interface IRawRouteParams {
	title?: string
	hidden?: boolean
	[key: string]: unknown
}

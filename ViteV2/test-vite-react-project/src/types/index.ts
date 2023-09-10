export interface IRawRouter {
	path?: string
	key?: string
	module?: string
	index?: boolean
	nest?: boolean
	hidden?: boolean
	params?: IRawRouteParams
	children?: IRawRouter[]
}

export interface IRawRouteParams {
	title?: string
	hidden?: boolean
	[key: string]: unknown
}

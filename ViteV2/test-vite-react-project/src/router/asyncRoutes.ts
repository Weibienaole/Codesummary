import { IRawRouter } from '@/types'

/*
  rules:
  每个路由都是真实存在的，二级标题导航（没有实际路由，只是标识，或者一个块）通过权限增加
  嵌套路由通过 nest 设置，且嵌套路由需要手动在父级添加 <Outlet /> 组件。默认情况下父子路由不相关
  所有和路由生成无关的参数全部集合在params中
  path 为 view下的路径
	
  routes = [
    path: string,
    module: string,
    childrens: [
      ...routes
    ]
  ]
*/

const rawRoutes: IRawRouter[] = [
	{
		index: true,
		module: 'home'
	},
	{
		key: 'docs',
		module: 'docs',
		params: {
			title: 'dddddocs'
		},
		children: [
			{
				key: 'child',
				module: 'docs/child'
			},
			{
				key: 'child2',
				module: 'docs/child/child2',
				children: [
					{
						key: 'child',
						module: 'docs/child/child3'
					}
				]
			}
		]
	}
	// {
	// 	key: 'add',
	// 	module: 'add',
	// 	nest: true,
	// 	children: [
	// 		{
	// 			key: 'detail',
	// 			module: 'add/detail'
	// 		},
	// 		{
	// 			key: 'detail/:id',
	// 			module: 'add/detail'
	// 		}
	// 	]
	// },
	// {
	// 	key: 'cos',
	// 	module: 'docs',
	// 	children: [
	// 		{
	// 			key: 'child',
	// 			module: 'docs'
	// 		}
	// 	]
	// }
]

export default rawRoutes

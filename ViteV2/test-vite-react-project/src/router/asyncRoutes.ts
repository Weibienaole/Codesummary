import { IRawRouter } from '@/types'

/*
  rules:
  每个路由都是真实存在的，二级标题导航（没有实际路由，只是标识，或者一个块）通过权限增加
  嵌套路由通过 nest 设置，且嵌套路由需要手动在父级添加 <Outlet /> 组件。默认情况下父子路由不相关
  所有和路由生成无关的参数全部集合在params中
  key为拼接path的最后一个,一般为文件路径的名称
	
  routes = [
    key: string,
    module: function,
    params: object 页面基本参数
    childrens: [
      ...routes
    ]
  ]
*/

const rawRoutes: IRawRouter[] = [
	{
		index: true, // 默认首显的页面
		module: () => import('@/views/home')
	},
	{
		key: 'docs',
		module: () => import('@/views/docs'),
		params: {
			title: 'dddddocs'
		},
		children: [
			{
				key: 'child',
				module: () => import('@/views/docs/child')
			},
			{
				key: 'child2',
				module: () => import('@/views/docs/child/child2'),
				children: [
					{
						key: 'child',
						module: () => import('@/views/docs/child/child3')
					}
				]
			}
		]
	},
	{
		key: 'add',
		module: () => import('@/views/add'),
		nest: true,
		children: [
			{
				key: 'detail',
				module: () => import('@/views/add/detail')
			},
			{
				key: 'detail/:id',
				module: () => import('@/views/add/detail')
			}
		]
	},
	{
		key: 'cos',
		module: () => import('@/views/docs'),
		children: [
			{
				key: 'child',
				module: () => import('@/views/docs')
			}
		]
	}
]

export default rawRoutes

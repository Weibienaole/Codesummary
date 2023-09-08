import React, { Component } from 'react'
/*
 错误边界
  1.请在App.js中用此组件将 Route组件包裹即可展示错误之后的UI信息
  2.它在渲染期间、生命周期方法和整个组件树的构造函数中捕获错误
  3.无法捕获 事件处理，异步代码等错误
*/

const style = {
	'font-size': '2.5rem',
	color: 'red',
	margin: '1rem',
	'word-break': 'break-word'
}
export default class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = {
			hasError: false
		}
	}
	static getDerivedStateFromError(error: unknown) {
		console.error(error, '更新state 使下一次的UI是降级后的UI')
		return { hasError: true }
	}
	componentDidCatch(error: unknown, errorInfo: unknown) {
		console.log(error, errorInfo, '将报错上传至服务器')
		console.log(
			'JSON化错误日志：error--------',
			JSON.stringify(error),
			'errorInfo---------',
			JSON.stringify(error)
		)
	}
	render() {
		if (this.state.hasError)
			return (
				<div style={style} className="errorBoundary-component_zzyDevtools">
					Something was wrong, please open the console to check the printing, or
					contact the Developer.
					<br />
					{this.props.mode === 'development' && (
						<div
						//onClick={() => copyToClipboard(window.location.href || 'none')}
						>
							<br />
							<span>link: {window.location.href || 'none'}</span>
							<br />
							<br />
							点击链接进行复制.
						</div>
					)}
				</div>
			)
		return this.props.children
	}
}

interface Props {
	children: unknown
	mode: 'development' | 'production'
}
interface State {
	hasError: boolean
}

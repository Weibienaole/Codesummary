import { Outlet, Link, useNavigate } from 'react-router-dom'

const Docs = (props) => {
	const navigate = useNavigate()
	console.log(props, 'props')

	return (
		<div>
			Docs
			<div
				onClick={() => {
					navigate('/docs/child')
				}}
			>
				go child
			</div>
			<Link to={'/docs/child'}>link childDOcs</Link>
			<Link to={'/docs/child2'}>link childDOcs2</Link>
			<Link to={'/cos/child'}>link cos</Link>
			<Outlet />
		</div>
	)
}

export default Docs

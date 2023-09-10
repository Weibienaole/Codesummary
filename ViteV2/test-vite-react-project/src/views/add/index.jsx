import { Link, Outlet, useNavigate } from 'react-router-dom'
const AddIndex = (props) => {
	console.log(props)
	const navigate = useNavigate()
	return (
		<div>
			AddIndex
			<div onClick={() => navigate('/add/detail')}>go detail</div>
			<div onClick={() => navigate('/add/detail/12')}>go detail 12</div>
			<div onClick={() => navigate('../docs')}>go docs</div>
			<Link to={'detail'}>link to details</Link>
			<Outlet />
		</div>
	)
}

export default AddIndex

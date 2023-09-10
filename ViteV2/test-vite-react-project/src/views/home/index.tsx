import { Outlet } from 'react-router-dom'

const Home = () => {
	return (
		<div>
			home
			<span className="s">text</span>
			<Outlet />
		</div>
	)
}

export default Home

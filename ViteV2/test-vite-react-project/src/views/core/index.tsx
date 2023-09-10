import { Outlet } from 'react-router-dom'

import { CoreSty } from './style'

const Core = () => {
	return (
		<CoreSty>
			core
			<div className="f">ssss</div>
			<Outlet />
		</CoreSty>
	)
}

export default Core

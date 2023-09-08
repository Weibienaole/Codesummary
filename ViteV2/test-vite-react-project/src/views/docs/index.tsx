import { useCreateOutletEl } from '@/utils'
import {
	Outlet,
	Link,
	useNavigate,
	useNavigation,
	useMatches,
	useOutlet
} from 'react-router-dom'
const Docs = (props) => {
	const navigate = useNavigate()
	const navigation = useNavigation()
	const route = useMatches()
	const outlet = useCreateOutletEl()
	//console.log(route, navigation, outlet)
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
			<Link to={'/cos/child'}>link cos</Link>
			{outlet}
		</div>
	)
}

export default Docs

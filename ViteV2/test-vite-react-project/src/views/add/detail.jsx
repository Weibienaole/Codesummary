import { useParams, useSearchParams } from 'react-router-dom'

const AddDetail = (props) => {
	const [params, setParams] = useSearchParams()

	console.log(props, useParams(), params.get('c'))

	return (
		<div>
			AddDetailAddDetail
			<div
				onClick={() =>
					setParams({
						c: '333'
					})
				}
			>
				set{' '}
			</div>
		</div>
	)
}

export default AddDetail

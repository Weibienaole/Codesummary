import { useNavigate } from 'react-router-dom'
const AddIndex = () => {
	const navigate = useNavigate()
	return (
		<div>
			AddIndex
			<div onClick={() => navigate('/add/detail')}>go detail</div>
		</div>
	)
}

export default AddIndex

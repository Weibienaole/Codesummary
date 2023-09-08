import { useOutlet } from 'react-router-dom'
export const useCreateOutletEl = () => {
	const outlet = useOutlet()
	return outlet
}

import { Link } from 'react-router-dom'

export const clientOnly = true

export function getMeta () { 
	return {
		title: 'Client Only Page'
	}
}

export default function ClientOnly () {
	return (
		<>
			<p>This route is rendered on the client only!</p>
			<p><Link to="/">Go back to the index</Link></p>
		</>
	)
}

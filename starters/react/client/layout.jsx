import 'virtual:uno.css'
import { Suspense } from 'react'

export default function Layout ({ children }) {
	return (
		<Suspense>
			{children}
		</Suspense>
	)
}

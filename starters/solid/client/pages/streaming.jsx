import { createResource } from 'solid-js'

export const streaming = true

export default function Streaming () {
  const [message] = createResource(afterSeconds)	
	return <Suspense><Message message={message()} /></Suspense>
}

function Message (props) {
	return (
		<p>{props.message}</p>
	)
}

function afterSeconds () {
	return new Promise((resolve) => {
    setTimeout(() => {
    	resolve('Hello')
    }, 5 * 1000)
  })
}

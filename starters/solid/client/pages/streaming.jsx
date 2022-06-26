import { createResource } from 'solid-js'

export const streaming = true

export default function Streaming () {
  const [message] = createResource(() => afterSeconds({
  	message: 'Delayed by Resource API',
  	seconds: 5,
  }))	
	return (
		<Suspense fallback={<p>Waiting for content</p>}>
			<Message message={message()} />
		</Suspense>
	)
}

function Message (props) {
	return (
		<p>{props.message}</p>
	)
}

function afterSeconds ({ message, seconds }) {
	return new Promise((resolve) => {
    setTimeout(() => {
    	resolve(message)
    }, seconds * 1000)
  })
}

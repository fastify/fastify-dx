import { createResource } from 'solid-js'
import { useRouteContext } from '/dx:core.js'

export const streaming = true

export default function Streaming () {
  const {state} = useRouteContext()
  const [message] = createResource(async () => {
    if (state.message) {
      return state.message
    }
    const message = await afterSeconds({
      message: 'Delayed by Resource API',
      seconds: 5,
    })
    state.message = message
    return message
  })
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

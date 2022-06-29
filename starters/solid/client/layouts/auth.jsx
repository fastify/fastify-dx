import { children } from 'solid-js'
import { useRouteContext } from '/dx:core.js'

export default function Auth (props) {
  const c = children(() => props.children)
  const { actions, state } = useRouteContext()
  const authenticate = () => actions.authenticate(state)
  return (
    <div class="contents">
      {state.user.authenticated
        ? c()
        : <Login onClick={() => authenticate()} /> }
    </div>
  )
}

function Login (props) {
  return (
    <>
      <p>This route needs authentication.</p>
      <button onClick={props.onClick}>
        Click this button to authenticate.
      </button>
    </>
  )
}
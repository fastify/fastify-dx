import { useRouteContext } from '/dx:core.js'

export default function Auth ({ children }) {
  const { actions, state } = useRouteContext()
  const authenticate = () => actions.authenticate(state)
  return (
    <div class="contents">
      {state.user.authenticated
        ? children
        : <Login onClick={() => authenticate()} /> }
    </div>
  )
}

function Login ({ onClick }) {
  return (
    <>
      <p>This route needs authentication.</p>
      <button onClick={onClick}>
        Click this button to authenticate.
      </button>
    </>
  )
}
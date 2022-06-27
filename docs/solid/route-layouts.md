<sub>**Go back to the [index](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-solid/README.md).**</sub>

<br>

## Route Layouts

Fastify DX will automatically load layouts from the `layouts/` folder. By default, `/dx:layouts/default.jsx` is used — that is, if a project is missing a `layouts/defaults.jsx` file, the one provided by Fastify DX is used instead. 

See the section on [Virtual Modules](https://github.com/fastify/fastify-dx/blob/main/docs/solid/virtual-modules.md) to learn more about this.

You assign a layout to a route by exporting `layout`. 

See [`pages/using-auth.jsx`](https://github.com/fastify/fastify-dx/blob/main/starters/solid/pages/using-auth.jsx) in the starter template:

```js
export const layout = 'auth'
```

That'll will cause the route to be wrapped in the layout component exported by [`layouts/auth.jsx`](https://github.com/fastify/fastify-dx/blob/main/starters/solid/layouts/auth.jsx):

```jsx
import { useRouteContext } from '/dx:core.js'

export default function Auth (props) {
  const { actions, state } = useRouteContext()
  const authenticate = () => actions.authenticate(state)
  return (
    <div class="contents">
      {state.user.authenticated
        ? props.children
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
```

Note that like routes, it has access to `useRouteContext()`.

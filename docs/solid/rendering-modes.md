<sub>**Go back to the [index](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-solid/README.md).**</sub>

<br>

# Rendering modes

Following the [URMA specification](https://github.com/fastify/fastify-dx/blob/main/URMA.md), Fastify DX's route modules can be set for universal rendering (SSR + CSR hydration, the default behavior), SSR in streaming mode, SSR only (client gets no JavaScript) or CSR only (SSR fully disabled). Fastify DX for Svelte supports all of these modes minus streaming, which is currently not yet supported by Svelte itself.

## `streaming`

If a route module exports `streaming` set to `true`, SSR will take place in **streaming mode**. That means if you have components depending on asynchronous resources and `<Suspense>` sections with defined fallback components, they will be streamed right way while the resources finish processing.

```jsx
import { createResource } from 'solid-js'
import { useRouteContext } from '/dx:core.js'

export const streaming = true

export default function Streaming () {
  const {state} = useRouteContext()
  const [message] = createResource(async () => {
    // If already retrieved on the server, no need
    // to wait for it on the client
    if (state.message) {
      return state.message
    }
    // Note: assignments to useRouteContext().state on the server
    // are automatically relayed to the client in the hydration payload
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
```

[See the full example](https://github.com/fastify/fastify-dx/blob/main/starters/solid/client/pages/streaming.jsx) in the [starter template](https://github.com/fastify/fastify-dx/tree/dev/starters/solid).

## `serverOnly`

If a route module exports `serverOnly` set to `true`, only SSR will take place. The client gets the server-side rendered markup without any accompanying JavaScript or data hydration.

You should use this setting to deliver lighter pages when there's no need to run any code on them, such as statically generated content sites.

```jsx
export const serverOnly = true

export default function ServerOnly (props) {
  return <p>This route is rendered on the server only!</p>
}
```

[This example](https://github.com/fastify/fastify-dx/blob/main/starters/solid/client/pages/server-only.jsx) is part of the [starter template](https://github.com/fastify/fastify-dx/tree/dev/starters/solid).

## `clientOnly`

If a route module exports `clientOnly` set to `true`, no SSR will take place, only data fetching and data hydration. The client gets the empty container element (the one that wraps `<!-- element -->` in `index.html`) and all rendering takes place on the client only.

You can use this setting to save server resources on internal pages where SSR makes no significant diference for search engines or UX in general, such as a password-protected admin section.

```jsx
export const clientOnly = true

export default function Route (props) {
  return <p>This route is rendered on the client only!</p>
}
```

[This example](https://github.com/fastify/fastify-dx/blob/main/starters/solid/client/pages/client-only.jsx) is part of the [starter template](https://github.com/fastify/fastify-dx/tree/dev/starters/solid).

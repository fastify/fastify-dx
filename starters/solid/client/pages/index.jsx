import logo from '/assets/logo.svg'
import { Link } from 'solid-app-router'
import { isServer, useRouteContext } from '/dx:core.js'

export function getMeta () {
  return {
    title: 'Welcome to Fastify DX!'
  }
}

export default function Index () {
  const { state } = useRouteContext()
  if (isServer) {
    // State is automatically hydrated on the client
    state.message = 'Welcome to Fastify DX for Solid!'
  }
  return (
    <>
      <img src={logo} alt="Fastify DX" />
      <h1>{state.message}</h1>
      <ul class="columns-2">
        <li><Link href="/using-data">/using-data</Link> demonstrates how to 
        leverage the <code>getData()</code> function 
        and <code>useRouteContext()</code> to retrieve server data for a route.</li>
        <li><Link href="/using-store">/using-store</Link> demonstrates how to 
        retrieve server data and maintain it in the global state.</li>
        <li><Link href="/using-auth">/using-auth</Link> demonstrates how to 
        wrap a route in a custom layout component.</li>
        <li><Link href="/client-only">/client-only</Link> demonstrates how to set 
        up a route for rendering on the client only (disables SSR).</li>
        <li><Link href="/server-only">/server-only</Link> demonstrates how to set 
        up a route for rendering on the server only (sends no JavaScript).</li>
        <li><Link href="/streaming">/streaming</Link> demonstrates how to set 
        up a route for SSR in streaming mode.</li>
      </ul>
    </>
  )
}

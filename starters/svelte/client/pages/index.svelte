<script context="module">
export let getMeta = () => {
  return {
    title: 'Welcome to Fastify DX!',
  }
}
</script>

<script>
import logo from '/assets/logo.svg'
import { Link } from 'svelte-navigator'
import { isServer, useRouteContext } from '/dx:core.js'
const { state } = useRouteContext()

if (isServer) {
  // Should be automatically hydrated on the client
  state.message = 'Welcome to Fastify DX for Svelte!'
}
</script>

<img src={logo} alt="Fastify DX" />
<h1>{state.message}</h1>
<ul class="columns-2">
  <li><Link to="/using-data">/using-data</Link> demonstrates how to 
  leverage the <code>getData()</code> function 
  and <code>useRouteContext()</code> to retrieve server data for a route.</li>
  <li><Link to="/using-store">/using-store</Link> demonstrates how to 
  leverage the 
  automated <a href="https://github.com/pmndrs/valtio">Valtio</a> store 
  to retrieve server data for a route and maintain it in a global 
  state even after navigating to another route.</li>
  <li><Link to="/using-auth">/using-auth</Link> demonstrates how to 
  wrap a route in a custom layout component.</li>
  <li><Link to="/client-only">/client-only</Link> demonstrates how to set 
  up a route for rendering on the client only (disables SSR).</li>
  <li><Link to="/server-only">/server-only</Link> demonstrates how to set 
  up a route for rendering on the server only (sends no JavaScript).</li>
</ul>

<script context="module">
export let getMeta = () => {
  return {
    title: 'Welcome to Fastify DX!'
  }
}
</script>

<script>
import logo from '/assets/logo.svg'
import { Link } from 'svelte-routing'
</script>

<img src={logo} alt="Fastify DX" />
<h1>Welcome to Fastify DX for Svelte!</h1>
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
  <li><Link to="/streaming">/streaming</Link> demonstrates how to set 
  up a route for SSR in streaming mode.</li>
</ul>

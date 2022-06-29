<script context="module">
export const serverOnly = true

export function getMeta () { 
  return {
    title: 'Server Only Page',
  }
}
</script>

<script>
import { Link } from 'svelte-routing'
</script>

<p>This route is rendered on the server only!</p>
<p>
  <Link to="/">Go back to the index</Link>
</p>
<p>⁂</p>
<p>When this route is rendered on the server, no JavaScript is sent to the client.</p>
<p>See the output of <code>curl http://localhost:3000/server-only</code>.</p>

<script>
import { proxy } from 'sveltio'
import { Router, Route } from 'svelte-routing'
import DXRoute from '/dx:route.svelte'
import { isServer } from '/dx:core.js'

export let url = null
export let payload

let state = isServer
  ? payload.serverRoute.state
  : proxy(payload.serverRoute.state)
</script>

<Router url="{url}">
  {#each payload.routes as { path, component }}
    <Route path="{path}" let:location>
      <DXRoute 
        path={path}
        location={location}
        state={state}
        payload={payload}
        component={component} />
    </Route>
  {/each}
</Router>

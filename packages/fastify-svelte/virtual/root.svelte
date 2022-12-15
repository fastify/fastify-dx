<script>
import { Router, Route } from 'svelte-navigator'
import DXRoute from '/dx:route.svelte'
import { isServer } from '/dx:core.js'

export let url = null
export let payload
</script>

<Router url="{url}">
  {#each payload.routes as { path, component }}
    <Route path="{path}" let:location>
      <DXRoute 
        path={path}
        location={location}
        payload={payload}
        component={component} />
    </Route>
  {/each}
</Router>

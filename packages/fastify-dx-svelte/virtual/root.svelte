<script>
import 'uno.css'
import { Router, Route } from 'svelte-routing'
import DXRoute from '/core/route.svelte'

export let url = null
export let head
export let routes
export let routeMap
export let ctxHydration
</script>

<Router url="{url}">
  {#each routes as { path, component }}
    <Route path="{path}" let:location>
      <DXRoute 
        location={location}
        head={head}
        ctx={routeMap[path]}
        ctxHydration={ctxHydration}
        component={component} />
    </Route>
  {/each}
</Router>

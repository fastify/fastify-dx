<script>
import 'uno.css'
import { proxy } from 'sveltio'
import { Router, Route } from 'svelte-routing'
import DXRoute from '/dx:route.svelte'

export let url = null
export let head
export let routes
export let routeMap
export let ctxHydration

const isServer = typeof process !== 'undefined'
const state = proxy(ctxHydration.state)
</script>

<Router url="{url}">
  {#each routes as { path, component }}
    <Route path="{path}" let:location>
    	<DXRoute 
    	  location={location}
    		head={head}
        state={state}
    		ctx={routeMap[path]}
    		ctxHydration={ctxHydration}
    		component={component} />
    </Route>
  {/each}
</Router>

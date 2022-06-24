<sub>**Go back to the [index](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-svelte/README.md).**</sub>

<br>

## Route Layouts

Fastify DX will automatically load layouts from the `layouts/` folder. By default, `/dx:layouts/default.svelte` is used — that is, if a project is missing a `layouts/defaults.svelte` file, the one provided by Fastify DX is used instead. 

See the section on [Virtual Modules](https://github.com/fastify/fastify-dx/blob/main/docs/svelte/virtual-modules.md) to learn more about this.

You assign a layout to a route by exporting `layout`. 

See [`pages/using-auth.svelte`](https://github.com/fastify/fastify-dx/blob/main/starters/svelte/pages/using-auth.svelte) in the starter template:

```js
export const layout = 'auth'
```

That'll will cause the route to be wrapped in the layout component exported by [`layouts/auth.svelte`](https://github.com/fastify/fastify-dx/blob/main/starters/svelte/layouts/auth.svelte):

```svelte
<script>
import { useRouteContext } from '/dx:core.js'
const { snapshot, actions, state } = useRouteContext()
</script>

<div class="contents">
  {#if !$snapshot.user.authenticated}
    <p>This route needs authentication.</p>
    <button on:click={() => actions.authenticate(state)}>
      Click this button to authenticate.
    </button>
  {:else}
  <slot />
  {/if}  
</div>
```

Note that like routes, it has access to `useRouteContext()`.

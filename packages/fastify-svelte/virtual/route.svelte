<script>
import { setContext } from 'svelte'
import Loadable from 'svelte-loadable'
import { proxy } from 'sveltio'
import { routeContext, jsonDataFetch } from '/dx:core.js'
import layouts from '/dx:layouts.js'

export let path
export let component
export let payload
export let location

const isServer = import.meta.env.SSR

let ctx = payload.routeMap[path]

ctx.state = proxy(payload.serverRoute.state)
payload.serverRoute.stateProxy = ctx.state
ctx.actions = payload.serverRoute.actions  

setContext(routeContext, {
  get routeContext () {
    return ctx
  },
})

if (isServer) {
  ctx.layout = payload.serverRoute.layout ?? 'default'
  ctx.data = payload.serverRoute.data
}

async function setup () {
  if (payload.serverRoute.firstRender) {
    ctx.data = payload.serverRoute.data
    ctx.layout = payload.serverRoute.layout ?? 'default'
    payload.serverRoute.firstRender = false
    return
  }
  ctx.layout = ctx.layout ?? 'default'
  const { getMeta, getData, onEnter } = await ctx.loader()
  if (getData) {
    try {
      const fullPath = `${location.pathname}${location.search}`
      const updatedData = await jsonDataFetch(fullPath)
      if (!ctx.data) {
        ctx.data = {}
      }
      if (updatedData) {
        Object.assign(ctx.data, updatedData)
      }
      ctx.error = null
    } catch (error) {
    	ctx.error = error
    }
  }
  if (getMeta) {
    const updatedMeta = await getMeta(ctx)
    if (updatedMeta) {
      payload.head.update(updatedMeta)
    }
  }
  if (onEnter) {
    const updatedData = await onEnter(ctx)
    if (updatedData) {
      Object.assign(ctx.data, updatedData)
    }
  }
}

let setupClientRouteContext = !isServer && setup()
</script>

{#if isServer}
  <svelte:component this={layouts[ctx.layout].default}>
    <svelte:component this={component} />
  </svelte:component>
{:else}
{#await setupClientRouteContext then}
  <svelte:component this={layouts[ctx.layout].default}>
    <Loadable loader={component} />
  </svelte:component>
{/await}
{/if}

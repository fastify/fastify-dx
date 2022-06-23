<script>
import { setContext } from 'svelte'
import Loadable from 'svelte-loadable'
import { routeContext, jsonDataFetch } from '/core.js'
import layouts from '/dx:layouts.js'

const isServer = import.meta.env.SSR

setContext(routeContext, {
  get routeContext () {
    return ctx
  }
})

export let state = null
export let location = null
export let component = null
export let head
export let ctx = null
export let ctxHydration = null

ctx.actions = ctxHydration.actions  

if (isServer) {
  ctx.layout = ctxHydration.layout ?? 'default'
  ctx.data = ctxHydration.data
  ctx.state = state
}

async function setup () {
  ctx.state = state
  if (ctxHydration.firstRender) {
    ctx.data = ctxHydration.data
    ctx.layout = ctxHydration.layout ?? 'default'
    ctxHydration.firstRender = false
    return
  }
  ctx.layout = ctx.layout || 'default'
  console.log('ctx.layout->', ctx.layout)
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
      head.update(updatedMeta)
    }
  }
  if (onEnter) {
    const updatedData = await onEnter(ctx)
    if (updatedData) {
      Object.assign(ctx.data, updatedData)
    }
  }
}

let promise = !isServer && setup()

console.log('layouts', layouts)
console.log('ctx.layout', ctx.layout)
console.log('layouts[ctx.layout]', layouts[ctx.layout])
</script>

{#if isServer}
  <svelte:component this={layouts[ctx.layout].default}>
    <svelte:component this={component} />
  </svelte:component>
{:else}
{#await promise}{:then}
  <svelte:component this={layouts[ctx.layout].default}>
    <Loadable loader={component} />
  </svelte:component>
{/await}
{/if}

<script>
import { setContext } from 'svelte'
import Loadable from 'svelte-loadable'
import { routeContext, jsonDataFetch } from '/core.js'
const isServer = import.meta.env.SSR

setContext(routeContext, {
  get routeContext () {
    return ctx
  }
})

export let location = null
export let component = null
export let head
export let ctx = null
export let ctxHydration = null

async function setup () {
  if (isServer) {
    ctx.data = ctxHydration.data
    ctx.state = ctxHydration.state
  } else {
    if (ctxHydration.firstRender) {
      ctx.data = ctxHydration.data
      ctx.state = ctxHydration.state
      ctxHydration.firstRender = false
      return
    }
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
}

let promise = setup()
</script>

{#if isServer}
  <svelte:component this={component} />
{:else}
{#await promise}{:then}
  <Loadable loader={component} />
{/await}
{/if}

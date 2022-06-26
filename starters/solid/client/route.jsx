import { createContext, createSignal, createResource, children } from 'solid-js'
import { isServer, Suspense } from 'solid-js/web'
import { Router, Routes, Route, useLocation } from 'solid-app-router'
import { RouteContext, jsonDataFetch } from '/dx:core.js'

export default function DXRoute (props) {
  const ctx = props.payload.routeMap[props.path]
  const location = useLocation()

  ctx.state = props.state
  ctx.actions = props.payload.serverRoute.actions  

  if (isServer) {
    ctx.layout = props.payload.serverRoute.layout ?? 'default'
    ctx.data = props.payload.serverRoute.data
  }

  async function setup () {
  	console.log('location', location)
    if (props.payload.serverRoute.firstRender) {
      ctx.data = props.payload.serverRoute.data
      ctx.layout = props.payload.serverRoute.layout ?? 'default'
      props.payload.serverRoute.firstRender = false
      return ctx
    }
    ctx.layout = ctx.layout ?? 'default'
    const { getMeta, getData, onEnter } = await ctx.loader()
    if (getData) {
      try {
        const fullPath = `${location.pathname}${location.search}`
        console.log('fullPath', fullPath)
        const updatedData = await jsonDataFetch(fullPath)
        console.log('updatedData', updatedData)
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
        props.payload.head.update(updatedMeta)
      }
    }
    if (onEnter) {
      const updatedData = await onEnter(ctx)
      if (updatedData) {
        Object.assign(ctx.data, updatedData)
      }
    }
    return ctx
  }

  let element
  if (isServer) {
    element = (
      <RouteContext.Provider value={ctx}>
        <props.component />
      </RouteContext.Provider>
    )
  } else {
    const [routeContext] = createResource(setup)
    element = (
      <Suspense>
        {!routeContext.loading && 
          <RouteContext.Provider value={routeContext()}>
            <props.component />
          </RouteContext.Provider>
        }
      </Suspense>
    )
  }
  return element
}

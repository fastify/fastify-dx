import { createResource } from 'solid-js'
import { isServer, Suspense } from 'solid-js/web'
import { useLocation } from 'solid-app-router'
import { RouteContext, jsonDataFetch } from '/dx:core.js'
import layouts from '/dx:layouts.js'

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
    if (props.payload.serverRoute.firstRender) {
      // ctx.hydration = payload.serverRoute.hydration
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
        <Layout id={ctx.layout}>
          <props.component />
        </Layout>
      </RouteContext.Provider>
    )
  } else {
    const [routeContext] = createResource(setup)
    element = (
      <Suspense>
        {!routeContext.loading && (
          <RouteContext.Provider value={routeContext()}>
            <Layout id={routeContext().layout}>
              <props.component />
            </Layout>
          </RouteContext.Provider>
        )}
      </Suspense>
    )
  }
  return element
}

function Layout (props) {
  console.log(layouts)
  if (layouts && layouts.length > 0) {
    const Component = layouts[props.id].default
    return <Component>{props.children}</Component>
  } else {
    const Component = layouts.default
    return <Component>{props.children}</Component>
  }
}

import React, { createContext, useContext, useEffect } from 'react'
import { useLocation, BrowserRouter, Routes, Route } from 'react-router-dom'
import { StaticRouter } from 'react-router-dom/server.mjs'
import { createPath } from 'history'
import { proxy, useSnapshot } from 'valtio'
import { waitResource, waitFetch } from '/dx:resource.js'

const isServer = typeof process === 'object'

export const RouteContext = createContext({})
export const HeadContext = createContext({})

export const BaseRouter = isServer ? StaticRouter : BrowserRouter

export function useRouteContext () {
  const routeContext = useContext(RouteContext)
  if (routeContext.state) {
    routeContext.snapshot = useSnapshot(routeContext.state)
  }
  return routeContext
}

export function EnhancedRouter ({
  head,
  routes,
  routeMap,
  ctxHydration,
}) {
  return (
    <HeadContext.Provider value={head}>
      <Routes>{
        routes.map(({ path, component: Component }) => {
          return <Route key={path} path={path} element={
            <RouteContextProvider
              head={head}
              ctxHydration={ctxHydration}
              ctx={routeMap[path]}>
              <Component />
            </RouteContextProvider>
          } />
        })
      }</Routes>
    </HeadContext.Provider>
  )
}

export function RouteContextProvider ({ head, ctxHydration, ctx, children }) {
  // If running on the server, assume all data
  // functions have already ran through the preHandler hook
  if (isServer) {
    console.log('ctxHydration.state', ctxHydration.state)
    return (
      <RouteContext.Provider value={{
        ...ctx,
        ...ctxHydration,
        state: proxy(ctxHydration.state),
      }}>
        {children}
      </RouteContext.Provider>
    )
  }
  // Note that on the client, window.route === ctxHydration

  // Indicates whether or not this is a first render on the client
  ctx.firstRender = window.route.firstRender

  // If running on the client, the server context data
  // is still available, hydrated from window.route
  if (ctx.firstRender) {
    ctx.data = window.route.data
    ctx.head = window.route.head
  }

  const location = useLocation()
  const path = createPath(location)

  // When the next route renders client-side,
  // force it to execute all URMA hooks again
  useEffect(() => {
    window.route.firstRender = false
  }, [location])

  // If we have a getData function registered for this route
  if (!ctx.data && ctx.getData) {
    try {
      const { pathname, search } = location
      // If not, fetch data from the JSON endpoint
      ctx.data = waitFetch(`${pathname}${search}`)
    } catch (status) {
      // If it's an actual error...
      if (status instanceof Error) {
        ctx.error = status
      }
      // If it's just a promise (suspended state)
      throw status
    }
  }

  if (!ctx.firstRender && ctx.getMeta) {
    const updateHead = async () => {
      const { getMeta } = await ctx.loader()
      head.update(await getMeta(ctx))
    }
    waitResource(path, 'getMeta', updateHead)
  }

  if (!ctx.firstRender && ctx.onEnter) {
    const runOnEnter = async () => {
      const { onEnter } = await ctx.loader()
      const updatedData = await onEnter(ctx)
      if (!ctx.data) {
        ctx.data = {}
      }
      Object.assign(ctx.data, updatedData)
    }
    waitResource(path, 'onEnter', runOnEnter)
  }

  return (
    <RouteContext.Provider value={{
      ...ctx,
      state: proxy(ctxHydration.state),
    }}>
      {children}
    </RouteContext.Provider>
  )
}

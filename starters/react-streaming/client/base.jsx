import React, { createContext, useContext, useEffect, Suspense } from 'react'
import { useLocation, BrowserRouter, Routes, Route } from 'react-router-dom'
import { StaticRouter } from 'react-router-dom/server.mjs'
import { createPath } from 'history'
import { RouteContext, useRouteContext } from './context.jsx'

const isServer = typeof process === 'object'
const Router = import.meta.env.SSR ? StaticRouter : BrowserRouter

export default function create (routes, ctx, url) {
  const routeMap = Object.fromEntries(routes.map((route) => {
    return [route.path, route]
  }))
  return (
    <Router location={url}>
      <Suspense>      
        <Routes>{
          routes.map(({ path, component: Component }) => {
            return <Route key={path} path={path} element={
              <EnhancedRoute serverCtx={ctx} ctx={routeMap[path]}>
                <Component />
              </EnhancedRoute>
            } />
          })
        }</Routes>
      </Suspense>
    </Router>
  )
}

function EnhancedRoute ({ serverCtx, ctx, children }) {
  // console.log('serverCtx', serverCtx)
  // console.log('ctx', ctx)
  // If running on the server, assume all data
  // functions have already ran through the preHandler hook
  if (isServer) {
    return (
      <RouteContext.Provider value={{...ctx, ...serverCtx}}>
        {children}
      </RouteContext.Provider>
    )
  }
  // If running on the client, the server context data
  // is still available, hydrated from window.route
  ctx.data = window.route.data

  const location = useLocation()
  const path = createPath(location)

  // Ensure we delete any available hydration
  // so the next time this route renders client-side, 
  // it's forced to fetch getData() on the server
  useEffect(() => {
    delete window.route.data
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
  // if (ctx.onEnter) {
  //   const runOnEnter = async ({ onEnter }) => {
  //     const updatedCxt = await onEnter(ctx)
  //     Object.assign(ctx, updatedCxt)
  //   }
  //   waitResource(path, ctx.loader().then(runOnEnter))
  // }

  return (
    <RouteContext.Provider value={ctx}>
      {children}
    </RouteContext.Provider>
  )
}

const fetchMap = new Map()
const resourceMap = new Map()

function waitResource (path, promise) {
  let loader
  // When waitFetch() is called the first time inside
  // a component, it'll create the resource object (loader) for
  // tracking its state, but the next time it's called, it'll
  // return the same resource object previously saved
  if (loader = resourceMap.get(path)) {
    // Handle error, suspended state or return loaded data
    if (loader.error) {
      throw loader.error
    }
    if (loader.suspended) {
      throw loader.promise
    }
    // Remove from fetchMap now that we have data
    resourceMap.delete(path)

    return loader.result
  } else {
    loader = {
      suspended: true,
      error: null,
      result: null,
      promise: null,
    }
    loader.promise = promise
      .then((result) => { loader.result = result })
      .catch((loaderError) => { loader.error = loaderError })
      .finally(() => { loader.suspended = false })

    // Save the active suspended state to track it
    resourceMap.set(path, loader)

    // Call again for handling tracked state
    return waitResource(path)
  }
}

function waitFetch (path) {
  let loader
  // When waitFetch() is called the first time inside
  // a component, it'll create the resource object (loader) for
  // tracking its state, but the next time it's called, it'll
  // return the same resource object previously saved
  if (loader = fetchMap.get(path)) {
    // Handle error, suspended state or return loaded data
    if (loader.error || loader.data?.statusCode === 500) {
      if (loader.data?.statusCode === 500) {
        throw new Error(loader.data.message)
      }
      throw loader.error
    }
    if (loader.suspended) {
      throw loader.promise
    }
    // Remove from fetchMap now that we have data
    fetchMap.delete(path)

    return loader.data
  } else {
    loader = {
      suspended: true,
      error: null,
      data: null,
      promise: null,
    }
    loader.promise = fetch(`/-/data${path}`)
      .then((response) => response.json())
      .then((loaderData) => { loader.data = loaderData })
      .catch((loaderError) => { loader.error = loaderError })
      .finally(() => { loader.suspended = false })

    // Save the active suspended state to track it
    fetchMap.set(path, loader)

    // Call again for handling tracked state
    return waitFetch(path)
  }
}

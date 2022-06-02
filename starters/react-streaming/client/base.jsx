import React, { createContext, useContext, useEffect, Suspense } from 'react'
import { useLocation, BrowserRouter, Routes, Route } from 'react-router-dom'
import { StaticRouter } from 'react-router-dom/server.mjs'
import { createPath } from 'history'
import { RouteContext, HeadContext, useRouteContext, useHead } from './context.jsx'

const isServer = typeof process === 'object'
const Router = import.meta.env.SSR ? StaticRouter : BrowserRouter

export default function create ({ 
  head,
  routes,
  routeMap,
  initialRoute,
  url,
}) {
  console.log('head:', head)
  return (
    <Router location={url}>
      <Suspense>
        <HeadContext.Provider value={head ?? {}}>
          <Routes>{
            routes.map(({ path, component: Component }) => {
              return <Route key={path} path={path} element={
                <EnhancedRoute 
                  head={head} 
                  initialRoute={initialRoute} 
                  ctx={routeMap[path]}>
                  <Component />
                </EnhancedRoute>
              } />
            })
          }</Routes>
        </HeadContext.Provider>
      </Suspense>
    </Router>
  )
}

function EnhancedRoute ({ head, initialRoute, ctx, children }) {
  console.log('EnhancedRoute')
  // console.log('initialRoute', initialRoute)
  // console.log('ctx', ctx)
  // If running on the server, assume all data
  // functions have already ran through the preHandler hook
  if (isServer) {
    console.log('returning')
    return (
      <RouteContext.Provider value={{...ctx, ...initialRoute}}>
        {children}
      </RouteContext.Provider>
    )
  }
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
      console.log('updateHead()')
      const { getMeta } = await ctx.loader()
      head.update(await getMeta(ctx))
    }
    console.log('waitResource()')
    waitResource(path, 'getMeta', updateHead)
  }

  if (!ctx.firstRender && ctx.onEnter) {
    const runOnEnter = async ({ onEnter }) => {
      const updatedData = await onEnter(ctx)
      if (!ctx.data) {
        ctx.data = {}
      }
      Object.assign(ctx.data, updatedData)
    }
    waitResource(path, 'onEnter', () => ctx.loader().then(runOnEnter))
  }

  return (
    <RouteContext.Provider value={ctx}>
      {children}
    </RouteContext.Provider>
  )
}

const fetchMap = new Map()
const resourceMap = new Map()

function waitResource (path, id, promise) {
  const resourceId = `${path}:${id}`
  const loader = resourceMap.get(resourceId)
  // When waitFetch() is called the first time inside
  // a component, it'll create the resource object (loader) for
  // tracking its state, but the next time it's called, it'll
  // return the same resource object previously saved
  if (loader) {
    // Handle error, suspended state or return loaded data
    if (loader.error) {
      throw loader.error
    }
    if (loader.suspended) {
      throw loader.promise
    }
    // Remove from fetchMap now that we have data
    resourceMap.delete(resourceId)

    return loader.result
  } else {
    const loader = {
      suspended: true,
      error: null,
      result: null,
      promise: null,
    }
    loader.promise = promise()
      .then((result) => { loader.result = result })
      .catch((loaderError) => { loader.error = loaderError })
      .finally(() => { loader.suspended = false })

    // Save the active suspended state to track it
    resourceMap.set(resourceId, loader)

    // Call again for handling tracked state
    return waitResource(path, id)
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

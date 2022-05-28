import React from 'react'
import { StaticRouter } from 'react-router-dom/server'
import { useLocation, Route as BaseRoute, Routes, BrowserRouter } from 'react-router-dom'
import { createFetchWithSuspense } from './supense.js'

const isServer = (
  typeof process === 'object' ||
  // For whenever this stack supports Worker runtimes
  typeof importScripts === 'function'
)

const BaseRouter = isServer ? StaticRouter : BrowserRouter

export function Router ({ routes, ctx }) {
  return (
    <BaseRouter>
      <Routes>{
        routes.map(({ path, component: Component }) => {
          return <BaseRoute key={path} path={path} element={<Component />} />
          //   <Route
          //     ctx={ctx}
          //     fetchWithSuspense={createFetchWithSuspense(path)}
          //     hasOnEnter={hasOnEnter}
          //     component={component} />
          // } />
        })
      }</Routes>
    </BaseRouter>
  )
}

function Route ({
  ctx,
  fetchWithSuspense,
  hasGetData,
  onEnter,
  component: Component,
}) {
  // If running on the server...
  // See if we already have serverSideProps populated
  // via the registered preHandler hook and passed
  // down via the SSR context
  if (ctx) {
    if (ctx.data) {
      return <Component {...ctx.data} />
    } else {
      return <Component />
    }
  }
  // If running on the client...
  // Retrieve data hydration if available
  let data = window.hydration.data
  // Ensure hydration is always cleared after the first page render
  window.hydration = {}
  if (hasGetData) {
    // First check if we have data hydration
    if (data) {
      return <Component {...data} />
    }
    const { pathname, search } = useLocation()
    try {
      // If not, fetch data from the JSON endpoint
      data = fetchWithSuspense(`${pathname}${search}`)
      return <Component {...data} />
    } catch (error) {
      // If it's an actual error...
      if (error instanceof Error) {
        return <p>Error: {error.message}</p>
      }
      // If it's just a promise (suspended state)
      throw error
    }
  }
  return <Component />
}

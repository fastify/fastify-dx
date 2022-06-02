import React from 'react'
import { useLocation, Route as BaseRoute, Routes } from 'react-router-dom'
import { createFetchWithSuspense } from './suspense.js'

export function Router ({ routes, ctx }) {
  console.log(routes, ctx)
  return (
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
  )
}

function ManagedRoute ({
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

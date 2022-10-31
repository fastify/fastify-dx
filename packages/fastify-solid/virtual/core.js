import { createContext, useContext } from 'solid-js'

// Solid already exports isServer, but this
// is for consistency with the other implementations
export const isServer = import.meta.env.SSR
export const RouteContext = createContext()

export function useRouteContext () {
  return useContext(RouteContext)
}

export async function jsonDataFetch (path) {
  const response = await fetch(`/-/data${path}`)
  let data
  let error
  try {
    data = await response.json()
  } catch (err) {
    error = err
  }
  if (data?.statusCode === 500) {
    throw new Error(data.message)
  }
  if (error) {
    throw error
  }
  return data
}

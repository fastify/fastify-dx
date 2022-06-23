import { getContext } from 'svelte'

export const routeContext = Symbol('routeContext')

export function useRouteContext () {
  return getContext(routeContext).routeContext
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

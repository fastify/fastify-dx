import { getContext } from 'svelte'
import { useSnapshot } from 'sveltio'

export const isServer = import.meta.env.SSR
export const routeContext = Symbol('routeContext')

export function useRouteContext () {
  const { 
    routeContext: ctx, 
    state,
    actions
  } = getContext(routeContext)
  ctx.state = state
  ctx.actions = actions
  ctx.snapshot = useSnapshot(state)
  return ctx
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

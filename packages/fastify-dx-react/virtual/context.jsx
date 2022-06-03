import { createContext, useContext } from 'react'

export const HeadContext = createContext({})
export const RouteContext = createContext({})

export function useRouteContext () {
  return useContext(RouteContext)
}

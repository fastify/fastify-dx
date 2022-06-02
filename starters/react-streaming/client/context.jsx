import { createContext, useContext, useState, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { createPath } from 'history'

const isServer = typeof process === 'object'

export const HeadContext = createContext({})
export const RouteContext = createContext({})

export function useHead (initial) {
  const head = useContext(HeadContext)
  if (!isServer && initial) {
    head.update(initial)
  }
  return head
}

export function useRouteContext () {
  return useContext(RouteContext)
}

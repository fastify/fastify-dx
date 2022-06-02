import { createContext, useContext, useState, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { createPath } from 'history'

export const RouteContext = createContext({})

export function useRouteContext () {
  return useContext(RouteContext)
}

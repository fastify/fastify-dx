import React from 'react'

export default [
  {
    path: '/',
    component: React.lazy(() => import('/views/index.jsx')),
  },
  {
    path: '/other',
    component: React.lazy(() => import('/views/other.jsx')),
    serverOnly: true,
  },
  {
    path: '/client-only',
    component: React.lazy(() => import('/views/client-only.jsx')),
    clientOnly: true,
  },
]

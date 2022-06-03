import React, { Suspense } from 'react'
import { BaseRouter, EnhancedRouter } from '/dx:router.jsx'

export default function Base ({ url, ...routerSettings }) {
  return (
    <BaseRouter location={url}>
      <Suspense>
        <EnhancedRouter {...routerSettings} />
      </Suspense>
    </BaseRouter>
  )
}

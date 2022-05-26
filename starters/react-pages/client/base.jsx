import { Suspense } from 'react'
import { Router } from 'fastify-dx-react'

import routes from '/routes.js'

export default (ctx, url) => {
  return (
    <Suspense>
      <Router routes={routes} ctx={ctx} location={url} />
    </Suspense>
  )
}

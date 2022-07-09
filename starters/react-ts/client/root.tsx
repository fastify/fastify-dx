import 'virtual:uno.css'
import { Suspense } from 'react'
import { DXApp } from '/dx:core.jsx'

export default function Root ({ url, routes, head, ctxHydration, routeMap }) {
  return (
    <Suspense>
      <Router location={url}>
        <Routes>{
          routes.map(({ path, component: Component }) =>
            <Route
              key={path}
              path={path}
              element={
                <DXRoute
                  head={head}
                  ctxHydration={ctxHydration}
                  ctx={routeMap[path]}>
                  <Component />
                </DXRoute>
              } />,
          )
        }</Routes>
      </Router>
    </Suspense>
  )
}
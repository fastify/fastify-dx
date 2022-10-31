import { createMutable } from 'solid-js/store'
import { Router, Routes, Route } from 'solid-app-router'
import DXRoute from '/dx:route.jsx'
import { isServer } from '/dx:core.js'

export default function Root (props) {
  // eslint-disable-next-line solid/reactivity
  props.payload.serverRoute.state = isServer
    ? props.payload.serverRoute.state
    : createMutable(props.payload.serverRoute.state)
  // This is so we can serialize state into the hydration payload after SSR is done
  return (
    <Router url={props.url}>
      <Routes>{
        // eslint-disable-next-line solid/prefer-for
        props.payload.routes.map(route =>
          <Route path={route.path} element={
            <DXRoute
              state={props.payload.serverRoute.state}
              path={route.path}
              payload={props.payload}
              component={route.component} />
          } />,
        )
      }</Routes>
    </Router>
  )
}

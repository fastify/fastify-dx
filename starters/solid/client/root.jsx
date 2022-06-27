import 'uno.css'
import { createMutable } from 'solid-js/store'
import { Router, Routes, Route } from 'solid-app-router'
import DXRoute from '/dx:route.jsx'

export default function Root (props) {
  props.payload.serverRoute.state = createMutable(props.payload.serverRoute.state)
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
          } />
        )
      }</Routes>
    </Router>
  )
}

import 'uno.css'
import { createContext, useContext, createSignal, children } from 'solid-js'
import { isServer, Suspense } from 'solid-js/web'
import { createMutable } from 'solid-js/store'
import { Router, Routes, Route } from 'solid-app-router'
import DXRoute from '/dx:route.jsx'

export default function Root (props) {
  const state = createMutable(props.payload.serverRoute.state)
  return (
    <Router url={props.url}>
      <Routes>{
        // eslint-disable-next-line solid/prefer-for
        props.payload.routes.map(route =>
          <Route path={route.path} element={
            <DXRoute
              state={state}
              path={route.path}
              payload={props.payload}
              component={route.component} />
          } />
        )
      }</Routes>
    </Router>
  )
}

import 'uno.css'
import { sharedConfig, createContext, useContext, createSignal, children } from 'solid-js'
import { Suspense, isServer } from 'solid-js/web'
import { createMutable } from 'solid-js/store'
import { Router, Routes, Route } from 'solid-app-router'
import DXRoute from '/dx:route.jsx'

// TODO Figure out why this is necessary and how safe it is
sharedConfig.context = { suspense: {} }

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

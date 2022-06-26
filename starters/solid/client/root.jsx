import 'uno.css'
import { createContext, useContext, createSignal, children } from 'solid-js'
import { isServer, Suspense } from 'solid-js/web'
import { Router, Routes, Route } from 'solid-app-router'
import DXRoute from '/dx:route.jsx'

export default function Root (props) {
  return (
    <Router url={props.url}>
      <Routes>{
        // eslint-disable-next-line solid/prefer-for
        props.payload.routes.map(route =>
          <Route path={route.path} element={
            <DXRoute 
              path={route.path}
              payload={props.payload}
              component={route.component} />
          } />
        )
      }</Routes>
    </Router>
  )
}

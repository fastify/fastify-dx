import 'uno.css'
import { createContext, useContext, createSignal } from 'solid-js'
import { Router, Routes, Route } from 'solid-app-router'

export default function Root (props) {
  return (
    <Router>
      <Routes>{
        // eslint-disable-next-line solid/prefer-for
        props.payload.routes.map((route) => {
          return <Route path={route.path} element={
            <route.component />
          } />
        })
      }</Routes>
    </Router>
  )
}

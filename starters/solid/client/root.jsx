import 'uno.css'
import { createContext, useContext, createSignal, children } from 'solid-js'
import { isServer, Suspense } from 'solid-js/web'
import { Router, Routes, Route } from 'solid-app-router'

const Fragment = props => <>{children(() => props.children)}</>
const Async = isServer ? Fragment : Suspense

export default function Root (props) {
  return (
    <Router>
      <Routes>{
        // eslint-disable-next-line solid/prefer-for
        props.payload.routes.map((route) => {
          return <Route path={route.path} element={
            <Async>
              <route.component />
            </Async>
          } />
        })
      }</Routes>
    </Router>
  )
}

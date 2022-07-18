import 'uno.css'
import { createMutable } from 'solid-js/store'
import { Router, Routes, Route } from 'solid-app-router'
import DXRoute from '/dx:route.jsx'
import { isServer } from '/dx:core.js'
import { For, mergeProps } from 'solid-js'

export default function Root(props) {
  props = mergeProps(
    {
      state: isServer
        ? props.payload.serverRoute.state
        : createMutable(props.payload.serverRoute.state)
    },
    props
  )

  // This is so we can serialize state into the hydration payload after SSR is done
  return (
    <Router url={props.url}>
      <Routes>
        {
          <For each={props.payload.routes}>
            {(route) => (
              <Route
                path={route.path}
                element={
                  <DXRoute
                    state={props.payload.serverRoute.state}
                    path={route.path}
                    payload={props.payload}
                    component={route.component}
                  />
                }
              />
            )}
          </For>
        }
      </Routes>
    </Router>
  )
}

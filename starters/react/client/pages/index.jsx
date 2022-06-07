import { Link } from 'react-router-dom'

export default function Index () {
  return (
    <>
      <img src="/assets/logo.svg" />
      <h1>Welcome to Fastify DX for React!</h1>
      <p>All route examples are the same simple to-do list app, implemented in 
      different ways.</p>
      <ul>
        <li><Link to="/using-data">/using-data</Link> demonstrates how to leverage the 
        getData() function export and useRouteContext() to retrieve server data 
        for a route.</li>
        <li><Link to="/using-store">/using-store</Link> demonstrates how to leverage the 
        automated Valtio store to retrieve server data for a route and 
        maintain it in a global state even after navigating to another route.</li>
        <li><Link to="">/client-only</Link> demonstrates how to leverage the 
        automated Valtio store to retrieve server data for a route and 
        maintain it in a global state even after navigating to another route.</li>
      </ul>
    </>
  )
}

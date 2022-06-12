
## Virtual Modules

**Fastify DX** relies on [virtual modules](https://github.com/rollup/plugins/tree/master/packages/virtual) to save your project from having too many boilerplate files. Virtual modules are a [Rollup](https://rollupjs.org/guide/en/) feature exposed and fully supported by [Vite](https://vitejs.dev/). When you see imports that start with `/dx:`, you know a Fastify DX virtual module is being used.

Fastify DX virtual modules are **fully ejectable**. For instance, the starter template relies on the `/dx:base.jsx` virtual module to provide the React Router shell of your application. If you copy the `base.jsx` file [from the fastify-dx-react package](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-react/virtual/base.jsx) and place it your Vite project root, **that copy of the file is used instead**.

The starter template comes with two virtual modules already ejected and part of the local project — `context.js` and `layout.jsx`, because they **are supposed to be user-provided** anyway. If you absolutely don't need to customize them, you can safely removed them from your copy of the starter template.

<table>
<tr>
<td width="400px" valign="top">

### `/dx:layout.jsx`

This is the root layout React component. It's used internally by `/dx:base.jsx` and provided as part of the starter template. You can use this file to add a common layout to all routes, or just use it to add additional, custom context providers.

</td>
<td width="600px"><br>

The version provided as part of the starter template includes [UnoCSS](https://github.com/unocss/unocss)'s own virtual module import, necessary to enable its CSS engine.

```jsx
import 'virtual:uno.css'
import { Suspense } from 'react'

export default function Layout ({ children }) {
  return (
    <Suspense>
      {children}
    </Suspense>
  )
}
```


</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### `/dx:routes.js`

Fastify DX has **code-splitting** out of the box. It does that by eagerly loading all route data on the server, and then hydrating any missing metadata on the client. That's why the routes module default export is conditioned to `import.meta.env.SSR`, and different helper functions are called for each rendering environment.

</td>
<td width="600px"><br>

```js
export default import.meta.env.SSR
  ? createRoutes(import.meta.globEager('$globPattern'))
  : hydrateRoutes(import.meta.glob('$globPattern'))
```

See [the full file](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-react/virtual/base.jsx) for the `createRoutes()` and `hydrateRoutes()` definitions. 

If you want to use your own custom routes list, you must eject this file as-is and replace the glob imports with your own routes list:

```js
const routes = [
  { 
    path: '/', 
    component: () => import('/custom/index.jsx'),
  }
]

export default import.meta.env.SSR
  ? createRoutes(routes)
  : hydrateRoutes(routes)
````

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### `/dx:router.jsx`

Implements the `BaseRouter` and `EnhancedRouter` components, both used by `base.jsx`, and also the `useRouteContext()` hook.

</td>
<td width="600px"><br>

You'll want to customize this file if you want to set up your own [React Router](https://reactrouter.com/docs/en/v6) routes component layout to leverage [nested routing](https://reactrouter.com/docs/en/v6/getting-started/concepts#nested-routes).

See its full definition [here](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-react/virtual/router.jsx).

</td>
</tr>
</table>


<table>
<tr>
<td width="400px" valign="top">

### `/dx:base.jsx`

The `base.jx` virtual import holds your root React component. This is where the [React Router](https://reactrouter.com/docs/en/v6) root component for your application is also set.

</td>
<td width="600px"><br>

<b>You'll rarely need to customize this file.</b>

```jsx
import React, { Suspense } from 'react'
import { BaseRouter, EnhancedRouter } from '/dx:router.jsx'

export default function Base ({ url, ...routerSettings }) {
  return (
    <BaseRouter location={url}>
      <Suspense>
        <EnhancedRouter {...routerSettings} />
      </Suspense>
    </BaseRouter>
  )
}
```

What you see above is its [full definition](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-react/virtual/base.jsx).

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### `/dx:mount.js`

This is the file `index.html` links to by default. It sets up the application with an `unihead` instance for head management, the initial route context, and provides the conditional mounting logic to defer to CSR-only if `clientOnly` is enabled.

</td>
<td width="600px"><br>

<b>You'll rarely need to customize this file.</b>

[See the full file](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-react/virtual/mount.js) for the `mount()` function definition.

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### `/dx:resource.js`

Provides the `waitResource()` and `waitFetch()` data fetching helpers implementing the [Suspense API](https://17.reactjs.org/docs/concurrent-mode-suspense.html). They're used by `/dx:router.jsx`.

</td>
<td width="600px"><br>

<b>You'll rarely need to customize this file.</b>

See its full definition [here](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-react/virtual/resource.js).

</td>
</tr>
</table>

## Routing mode

By default, routes are loaded from the `<project-root>/pages` folder, where `<project-root>` refers to the `root` setting in `vite.config.js`. The route paths are dynamically inferred from the directory structure, very much like Next.js and Nuxt.js.

<table>
<tr>
<td width="400px" valign="top">

### Dynamic parameters

Dynamic route parameters follow the [Next.js convention](https://nextjs.org/docs/basic-features/pages#pages-with-dynamic-routes) (`[param]`), but that can be overriden by using the `paramPattern` plugin option. For example, this configuration switches the param pattern to the [Remix convention](https://remix.run/docs/en/v1/guides/routing#dynamic-segments) (`$param`).

</td>
<td width="600px"><br>

```js
// ...
const plugins = [
  // ...
  viteReactFastifyDX({ paramPattern: /\$(\w+)/ }),
]
```

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### Routes location

You can also change the glob pattern used to determine where to route modules from. 

Since this setting is passed to [Vite's glob importers](https://vitejs.dev/guide/features.html#glob-import), the value needs to be a string:

</td>
<td width="600px"><br>

```js
// ...
const plugins = [
  // ...
  viteReactFastifyDX({ globPattern: '/views/**/*.jsx' }),
]
```

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### View modules

You also can export a `path` constant from your route modules, in which case its value will be used to **override the dynamically inferred paths from the directory structure**. 

Additionally, [**you can provide your own routes**](https://github.com/fastify/fastify-dx/tree/dev/packages/fastify-dx-react#dxroutesjs).

</td>
<td width="600px"><br>

```jsx
export const path = '/my-page'

export defaut function MyPage () {
  return <p>Route with path export</p>
}
```

</td>
</tr>
</table>

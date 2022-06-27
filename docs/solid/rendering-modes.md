<sub>**Go back to the [index](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-solid/README.md).**</sub>

<br>

# Rendering modes

Following the [URMA specification](https://github.com/fastify/fastify-dx/blob/main/URMA.md), Fastify DX's route modules can be set for universal rendering (SSR + CSR hydration, the default behavior), SSR in streaming mode, SSR only (client gets no JavaScript) or CSR only (SSR fully disabled). Fastify DX for Svelte supports all of these modes minus streaming, which is currently not yet supported by Svelte itself.

## `serverOnly`

If a route module exports `serverOnly` set to `true`, only SSR will take place. The client gets the server-side rendered markup without any accompanying JavaScript or data hydration.

You should use this setting to deliver lighter pages when there's no need to run any code on them, such as statically generated content sites.

```html
<script context="module">
export const serverOnly = true
</script>

<p>This route is rendered on the server only!</p>
```

[This example](https://github.com/fastify/fastify-dx/blob/main/starters/svelte/client/pages/server-only.svelte) is part of the [starter template](https://github.com/fastify/fastify-dx/tree/dev/starters/svelte).

## `clientOnly`

If a route module exports `clientOnly` set to `true`, no SSR will take place, only data fetching and data hydration. The client gets the empty container element (the one that wraps `<!-- element -->` in `index.html`) and all rendering takes place on the client only.

You can use this setting to save server resources on internal pages where SSR makes no significant diference for search engines or UX in general, such as a password-protected admin section.

```html
<script context="module">
export const clientOnly = true
</script>

<p>This route is rendered on the client only!</p>
```

[This example](https://github.com/fastify/fastify-dx/blob/main/starters/svelte/client/pages/client-only.svelte) is part of the [starter template](https://github.com/fastify/fastify-dx/tree/dev/starters/svelte).

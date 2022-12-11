
#### <img width="200px" alt="Fastify DX" src="https://user-images.githubusercontent.com/12291/163095704-d1bd8541-ecde-4707-8068-17d2fd725c01.svg">

**Fastify DX** is a collection of [**@fastify/vite**](https://fastify-vite.dev) renderers, allowing you to serve static or live (SSR) **Vue**, **React**, **Svelte** and **Solid** applications. Each renderer includes an extensible base application provided as [virtual modules](https://hire.jonasgalvez.com.br/2022/jun/10/virtual-modules-for-fun-and-profit/), implementing automatic **serialization**, **hydration**, **universal routing**, **data fetching** and **global state management**. They all follow the [URMA specification](https://github.com/fastify/fastify-dx/blob/main/URMA.md).

## Packages

**Currently Node v16+, Fastify v4+ and Vite v3+ are supported.**

- [**@fastify/react**](https://github.com/fastify/fastify-dx/tree/main/packages/fastify-react) supports **React v18+** and includes a base application with all logic needed for **universal routing** with [**React Router**](https://github.com/remix-run/react-router) and global state management with [**Valtio**](https://github.com/pmndrs/valtio). The [**starter template**]() is provided with [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react).
 
- [**@fastify/vue**](https://github.com/fastify/fastify-dx/tree/main/packages/fastify-vue) supports **Vue v3** and is built with [**@vitejs/plugin-vue**](https://github.com/vitejs/vite-plugin-vue). It is implemented with [**Vue Router**](https://github.com/vuejs/router) for universal routing and Vue's own [**reactive()**](https://vuejs.org/api/reactivity-core.html#reactive) primitive for global state management.
 
- [**@fastify/svelte**](https://github.com/fastify/fastify-dx/tree/main/packages/fastify-svelte) supports **Svelte v3**
 
- [**@fastify/solid**](https://github.com/fastify/fastify-dx/tree/main/packages/fastify-solid)

## Status

Fastify DX is currently in **beta**.

## Meta

Created by [Jonas Galvez](https://github.com/sponsors/galvez), **Principal Engineer** and **Open Sourcerer** at [NodeSource](https://nodesource.com).

## Gold Sponsors

<a href="https://nodesource.com"><img width="200px" src="https://user-images.githubusercontent.com/12291/206885948-3fa742a2-1057-4db2-8648-46f5cb673461.svg"></a>

[Contact me](mailto:jonasgalvez@gmail.com) to add your company's logo here.

## GitHub Sponsors

- [**Duc-Thien Bui**](https://github.com/aecea)
- [**Tom Preston-Werner**](https://github.com/mojombo) 
- [**Clifford Fajardo**](https://github.com/cliffordfajardo)
- [**David Adam Coffey**](https://github.com/dacoffey)
- [**Mezereon**](https://github.com/mezereon-co)
- [**A-J Roos**](https://github.com/Asjas)
- [**James Isaacs**](https://github.com/jamesisaacs2)

[Click here]((https://github.com/sponsors/galvez) to add your name to this list.

_Thank you!_

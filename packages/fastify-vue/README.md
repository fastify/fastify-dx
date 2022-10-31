# fastify-dx-vue [![NPM version](https://img.shields.io/npm/v/fastify-dx-vue.svg?style=flat)](https://www.npmjs.com/package/fastify-dx-vue) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)

- [**Introduction**](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-vue/README.md#introduction)
- [**Quick Start**](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-vue/README.md#quick-start)
- [**Package Scripts**](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-vue/README.md#package-scripts)
- [**Basic Setup**](https://github.com/fastify/fastify-dx/blob/main/docs/vue/basic-setup.md)
- [**Project Structure**](https://github.com/fastify/fastify-dx/blob/main/docs/vue/project-structure.md)
- [**Rendering Modes**](https://github.com/fastify/fastify-dx/blob/main/docs/vue/rendering-modes.md)
- [**Routing Configuration**](https://github.com/fastify/fastify-dx/blob/main/docs/vue/routing-config.md)
- [**Data Prefetching**](https://github.com/fastify/fastify-dx/blob/main/docs/vue/data-prefetching.md)
- [**Route Layouts**](https://github.com/fastify/fastify-dx/blob/main/docs/vue/route-layouts.md)
- [**Route Context**](https://github.com/fastify/fastify-dx/blob/main/docs/vue/route-context.md)
- [**Route Enter Event**](https://github.com/fastify/fastify-dx/blob/main/docs/vue/route-enter.md)
- [**Virtual Modules**](https://github.com/fastify/fastify-dx/blob/main/docs/vue/virtual-modules.md)

## Introduction

**Fastify DX for Vue** is a renderer adapter for [**fastify-vite**](https://github.com/fastify/fastify-vite).

It lets you run and SSR (server-side render) **Vue 3 applications built with Vite** on [Fastify](https://fastify.io/), with a minimal and transparent **server-first approach** — everything starts with `server.js`, your actual Fastify server. 

It also provides a set of built-in utilities for ease of development and managing a universal JavaScript context (SSR to CSR), very much like **Nuxt.js**, **Next.js** and **Remix**. Both **Fastify DX for Vue** and [**Fastify DX for React**](https://github.com/fastify/fastify-dx/tree/main/packages/fastify-dx-react) implement the [URMA specification](https://github.com/fastify/fastify-dx/blob/main/URMA.md) and have almost the same API, with only minimal differences due to specific framework APIs or idioms.

It is a **fast**, **lightweight** alternative to Nuxt.js packed with **Developer Experience** features.

It has an extremely small core (~1k LOC total) and is built on top of [Fastify](https://github.com/fastify/fastify), [Vite](https://vitejs.dev/) and [Vue Router](https://router.vuejs.org/).

[**See the release notes for the 0.0.1 alpha release**](https://github.com/fastify/fastify-dx/releases/tag/vue-v0.0.1).

> At this stage this project is mostly a [**one-man show**](https://github.com/sponsors/galvez), who's devoting all his free time to its completion. Contributions are extremely welcome, as well as bug reports for any issues you may find. 

In this first alpha release it's still missing a test suite. The same is true for [**fastify-vite**](). 

It'll move into **beta** status when test suites are added to both packages.

## Quick Start

Ensure you have **Node v16+**.

Make a copy of [**starters/vue**](https://github.com/fastify/fastify-dx/tree/dev/starters/vue). If you have [`degit`](https://github.com/Rich-Harris/degit), run the following from a new directory:

```bash
degit fastify/fastify-dx/starters/vue
```

> **If you're starting a project from scratch**, you'll need these packages installed.
>
> ```bash
> npm i fastify fastify-vite fastify-dx-vue -P
> npm i @vitejs/plugin-vue -D
> ```


Run `npm install`. 
  
Run `npm run dev`. 

Visit `http://localhost:3000/`.

## What's Included

That will get you a **starter template** with:
  
- A minimal [Fastify](https://github.com/fastify/fastify) server.
- Some dummy API routes.
- A `pages/` folder with some [demo routes](https://github.com/fastify/fastify-dx/tree/dev/starters/vue/client/pages).
- All configuration files.

It also includes some _**opinionated**_ essentials:

- [**PostCSS Preset Env**](https://www.npmjs.com/package/postcss-preset-env) by [**Jonathan Neal**](https://github.com/jonathantneal), which enables [several modern CSS features](https://preset-env.cssdb.org/), such as [**CSS Nesting**](https://www.w3.org/TR/css-nesting-1/).

- [**UnoCSS**](https://github.com/unocss/unocss) by [**Anthony Fu**](https://antfu.me/), which supports all [Tailwind utilities](https://uno.antfu.me/) and many other goodies through its [default preset](https://github.com/unocss/unocss/tree/main/packages/preset-uno). 

- [**VueUse**](https://vueuse.org/) by [**Anthony Fu**](https://antfu.me/), which provides an extremely rich set of utilities — they're not included in the project build unless explicitly imported and used.

## Package Scripts

`npm run dev` boots the development server.
  
`npm run build` creates the production bundle.
  
`npm run serve` serves the production bundle.

## Meta

Created by [Jonas Galvez](https://github.com/sponsors/galvez), **Engineering Manager** and **Open Sourcerer** at [NearForm](https://nearform.com).

## Sponsors

<a href="https://nearform.com"><img width="200px" src="https://user-images.githubusercontent.com/12291/172310344-594669fd-da4c-466b-a250-a898569dfea3.svg"></a>

Also [**Duc-Thien Bui**](https://github.com/aecea) and [**Tom Preston-Werner**](https://github.com/mojombo) [via GitHub Sponsors](https://github.com/sponsors/galvez). _Thank you!_

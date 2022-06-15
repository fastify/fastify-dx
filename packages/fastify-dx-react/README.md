# fastify-dx-react [![NPM version](https://img.shields.io/npm/v/fastify-dx-react.svg?style=flat)](https://www.npmjs.com/package/fastify-dx-react) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)

- [**Introduction**](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-react/README.md#introduction)
- [**Quick Start**](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-react/README.md#quick-start)
- [**Package Scripts**](https://github.com/fastify/fastify-dx/blob/main/packages/fastify-dx-react/README.md#package-scripts)
- [**Basic Setup**](https://github.com/fastify/fastify-dx/blob/main/docs/react/basic-setup.md)
- [**Project Structure**](https://github.com/fastify/fastify-dx/blob/main/docs/react/project-structure.md)
- [**Rendering Modes**](https://github.com/fastify/fastify-dx/blob/main/docs/react/rendering-modes.md)
- [**Routing Configuration**](https://github.com/fastify/fastify-dx/blob/main/docs/react/routing-config.md)
- [**Data Prefetching**](https://github.com/fastify/fastify-dx/blob/main/docs/react/data-prefetching.md)
- [**Route Layouts**](https://github.com/fastify/fastify-dx/blob/main/docs/react/route-layouts.md)
- [**Route Context**](https://github.com/fastify/fastify-dx/blob/main/docs/react/route-context.md)
- [**Route Enter Event**](https://github.com/fastify/fastify-dx/blob/main/docs/react/route-enter.md)
- [**Virtual Modules**](https://github.com/fastify/fastify-dx/blob/main/docs/react/virtual-modules.md)

## Introduction

**Fastify DX for React** is a renderer adapter for [**fastify-vite**](https://github.com/fastify/fastify-vite).

It is a **fast**, **lightweight** alternative to Next.js and Remix packed with **Developer Experience** features.

It has an extremely small core (~1k LOC total) and is built on top of [Fastify](https://github.com/fastify/fastify), [Vite](https://vitejs.dev/), [React Router](https://reactrouter.com/docs/en/v6) and [Valtio](https://github.com/pmndrs/valtio).

[**See the release notes for the 0.0.1 alpha release**](https://github.com/fastify/fastify-dx/releases/tag/v0.0.1).

> At this stage this project is mostly a [**one-man show**](https://github.com/sponsors/galvez), who's devoting all his free time to its completion. Contributions are extremely welcome, as well as bug reports for any issues you may find. 

In this first alpha release it's still missing a test suite. The same is true for [**fastify-vite**](). 

It'll move into **beta** status when test suites are added to both packages.

## Quick Start

Ensure you have **Node v16+**.

Make a copy of [**starters/react**](https://github.com/fastify/fastify-dx/tree/dev/starters/react). If you have [`degit`](https://github.com/Rich-Harris/degit), run the following from a new directory:

```bash
degit fastify/fastify-dx/starters/react
```

> **If you're starting a project from scratch**, you'll need these packages installed.
>
> ```bash
> npm i fastify fastify-vite fastify-dx-react -P
> npm i @vitejs/plugin-react -D
> ```


Run `npm install`. 
  
Run `npm run dev`. 

Visit `http://localhost:3000/`.

## What's Included

That will get you a **starter template** with:
  
- A minimal [Fastify](https://github.com/fastify/fastify) server.
- Some dummy API routes.
- A `pages/` folder with some [demo routes](https://github.com/fastify/fastify-dx/tree/dev/starters/react/client/pages).
- All configuration files.

It also includes some _**opinionated**_ essentials:

- [**PostCSS Preset Env**](https://www.npmjs.com/package/postcss-preset-env) by [**Jonathan Neal**](https://github.com/jonathantneal), which enables [several modern CSS features](https://preset-env.cssdb.org/), such as [**CSS Nesting**](https://www.w3.org/TR/css-nesting-1/).

- [**UnoCSS**](https://github.com/unocss/unocss) by [**Anthony Fu**](https://antfu.me/), which supports all [Tailwind utilities](https://uno.antfu.me/) and many other goodies through its [default preset](https://github.com/unocss/unocss/tree/main/packages/preset-uno). 

- [**Valtio**](https://github.com/pmndrs/valtio) by [**Daishi Kato**](https://blog.axlight.com/), with a global and SSR-ready store which you can use anywhere.


## Package Scripts

`npm run dev` boots the development server.
  
`npm run build` creates the production bundle.
  
`npm run serve` serves the production bundle.

## Meta

Created by [Jonas Galvez](https://github.com/sponsors/galvez), **Engineering Manager** and **Open Sourcerer** at [NearForm](https://nearform.com).

## Sponsors

<a href="https://nearform.com"><img width="200px" src="https://user-images.githubusercontent.com/12291/172310344-594669fd-da4c-466b-a250-a898569dfea3.svg"></a>

Also [**Duc-Thien Bui**](https://github.com/aecea) and [**Tom Preston-Werner**](https://github.com/mojombo) [via GitHub Sponsors](https://github.com/sponsors/galvez). _Thank you!_

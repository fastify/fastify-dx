# Fastify DX's Conventions

## Client and Server Separation

The `src` folder is a poor choice for full stack applications.

You need *two* top-level directories, `server/` and `client/`, not just `src/`.

And having `server` and `client` under `src` justs adds a layer of redundancy.

Fastify DX's convention is to have:

- Configuration files at the root, things like `vite.config.js` and `postcss.config.cjs`.
- Top-level `server` file (or folder) and `client/` folder

When you run `dx setup`, that's the folder layout you get.

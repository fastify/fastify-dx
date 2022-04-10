const { renderToString } = require('@vue/server-renderer')
const { renderHeadToString } = require('@vueuse/head')
const devalue = require('devalue')

function createRenderFunction (createApp) {
  return async function render (fastify, req, reply, url, config) {
    const { renderer, entry, bundle } = config
    const { ctx, app, head, routes, router } = await createApp({
      fastify,
      req,
      reply,
      global: req.dx?.global,
      payload: req.dx?.payload,
      data: req.dx?.data,
      payloadPath: () => `/-/payload${req.dx.routerPath}`,
      api: req.api?.client,
      errors: {},
    })

    if (router) {
      router.push(url)
      await router.isReady()
    }

    const element = await renderToString(app, ctx)
    const { headTags, htmlAttrs, bodyAttrs } = head ? renderHeadToString(head) : {}
    const preloadLinks = renderPreloadLinks(ctx.modules, bundle.manifest)
    const hydrationScript = getHydrationScript(req, app.config.globalProperties, routes)

    return {
      head: {
        preload: preloadLinks,
        tags: headTags,
      },
      attrs: {
        html: htmlAttrs,
        body: bodyAttrs,
      },
      entry: renderer.clientEntryPoint,
      hydration: hydrationScript,
      element,
    }
  }
}

module.exports = {
  createRenderFunction,
}

function getHydrationScript (req, context, routes) {
  const globalData = req.dx?.global
  const data = req.dx?.data ?? context.data
  const payload = req.dx?.payload ?? context.payload
  const api = req.api?.meta
  let hydrationScript = ''
  if (routes || globalData || data || payload || api) {
    hydrationScript += '<script>'
    if (routes) {
      const clientRoutes = routes.map(({
        path,
        getPayload,
        getData,
        componentPath,
      }) => {
        return {
          hasPayload: !!getPayload,
          hasData: !!getData,
          path,
          componentPath,
        }
      })
      hydrationScript += addHydration('kRoutes', clientRoutes)
    }
    hydrationScript += addHydration('kAPI', api)
    hydrationScript += addHydration('kGlobal', globalData)
    hydrationScript += addHydration('kData', data)
    hydrationScript += '</script>'
    hydrationScript += '<script data-payload=true>'
    hydrationScript += addHydration('kPayload', payload)
    hydrationScript += '</script>'
  }
  return hydrationScript
}

function addHydration (key, hydration) {
  if (hydration) {
    return `window[Symbol.for('${key}')] = ${devalue(hydration)}\n`
  } else {
    return ''
  }
}

function renderPreloadLinks (modules, manifest) {
  if (!modules) {
    return
  }
  let links = ''
  const seen = new Set()
  for (const id of modules) {
    const files = manifest[id]
    if (files) {
      for (const file of files) {
        if (seen.has(file)) {
          continue
        }
        const preloadLink = getPreloadLink(file)
        if (preloadLink) {
          links += `${preloadLink}\n`
        }
        seen.add(file)
      }
    }
  }
  return links
}

// Based on https://github.com/vitejs/vite/blob/main/packages/playground/ssr-vue/src/entry-server.js
function getPreloadLink (file) {
  if (file.endsWith('.js')) {
    return `<link rel="modulepreload" crossorigin href="${file}">`
  } else if (file.endsWith('.css')) {
    return `<link rel="stylesheet" href="${file}">`
  } else if (file.endsWith('.woff')) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`
  } else if (file.endsWith('.woff2')) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`
  } else if (file.endsWith('.gif')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/gif">`
  } else if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`
  } else if (file.endsWith('.png')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/png">`
  }
}

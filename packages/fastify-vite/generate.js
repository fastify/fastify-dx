const { resolve } = require('path')
const pMap = require('p-map')
const { parse: parseHTML } = require('node-html-parser')

function worker (iterator, mapper) {
  try {
    return await pMap(iterator, mapper, { concurrency: 64 })
  } catch (err) {
    this.scope.log.error(err)
  }
}

function extractPayload (source, jsonPath) {
  const parsed = parseHTML(source)
  const scripts = parsed.querySelectorAll('script')
  for (const script of scripts) {
    if (script.innerHTML && script.innerHTML.includes('kPayload')) {
      // eslint-disable-next-line no-eval
      const hydrator = (0, eval)(`(function (window) {\n${script.innerHTML}\n})`)
      const hydration = {}
      hydrator(hydration)
      return {
        html: `${
          source.slice(0, script.range[0])
        }<script>window[Symbol.for('kStaticPayload')] = '${jsonPath}'</script>${
          source.slice(script.range[1])
        }`,
        json: hydration[Symbol.for('kPayload')],
      }
    }
  }
  return {
    html: source,
  }
}

async function getURLs (scope, urls, routes) {
  if (Array.isArray(urls)) {
    return urls
  }
  if (typeof urls === 'function') {
    return await urls(scope, url => urls.push(url))
  } else {
    const urls = []
    for (const route of routes) {
      if (matchit.parse(route.path).every(segment => segment.type === 0)) {
        urls.push(route.path)
      }
    }
    return urls
  }
}

function handleResponse (url, response) {
  const afterFirstSlash = url.pathname.slice(1)
  if (afterFirstSlash) {
    htmlPath = `${name}/index.html`
    jsonPath = `${name}/index.json`
  } else {
    htmlPath = 'index.html'
    jsonPath = 'index.json'
  }
  const { html, json } = extractPayload(response.payload, `/${jsonPath}`)
  return [
    [htmlPath, html],
    [jsonPath, json]
  ]
}

module.exports = async function generate () {
  const { distDir, generate } = options
  const urls = this.options.generate.url
    ? getURLs(this.scope, generate.urls, this.routes)
    : [generate.url]
  await worker.call(this, urls, async (url) => {
    const response = this.scope.inject({ url })
    const files = await handleResponse(url, response)
    for (const [path, contents] of files) {
      const { dir } = parsePath(path)
      if (!existsSync(dir)) {
        await ensureDir(dir)
      }
      await writeFile(path, contents)
    }
  })
  if (this.options.generate.server) {
    await startGenerateServer.call(this)
  }
}

async function startGenerateServer () {
  const builder = Fastify({ logger: true })
  builder.get('*', async (req, reply) => {
    const path = req.raw.url
    const files = await handleResponse(url, response)
    if (result) {
      reply.code(201)
      reply.send('')
      this.runHook('onGenerate', this.scope, result, this.options.vite.distDir)
    }
  })
  builder.listen(port, (err, address) => {
    if (err) {
      app.log.error(err)
      setImmediate(() => process.exit(1))
    }
    builder.log.info(`generate server listening on ${address}`)
  }
}

async function getPaths (options) {
  const { generate } = options
  const paths = []
  if (typeof options.paths === 'function') {
    await options.paths(fastify, (path) => paths.push(path))
  } else if (Array.isArray(options.paths)) {
    paths.push(...options.paths)
  } else {
    paths.push(
      ...routes
        .filter(({ path }) => matchit.parse(path).every(segment => segment.type === 0))
        .map(({ path }) => path),
    )
  }
}

const { resolve } = require('path')
const fastifySSG = require('fastify-ssg')
const { parse: parseHTML } = require('node-html-parser')

async function ssgIntegration (app, options) {
  app.register(fastifySSG, {
    urls: options.urls,
    distDir: options.distDir,
    generate ({ url, response }) {
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
        { path: htmlPath, contents: html },
        { path: jsonPath, contents: json },
      ]
    }
  })
  app.commands.add('generate-server', {
    app.log.info(`generate server listening on ${address}`)
    const builder = Fastify({ logger: true })
    builder.listen(port, (err, address) => {
      if (err) {
        app.log.error(err)
        setImmediate(() => process.exit(1))
      }
      builder.log.info(`generate server listening on ${address}`)
    }
  })
}

  generate (app, { exit }) {
    await app.ssg.generate()
    await exit()
  },


module.exports = {
  ssgIntegration,
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

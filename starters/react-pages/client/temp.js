export function createRoutes ({}) {
  return Object.keys(importMap)
    // Ensure that static routes have
    // precedence over the dynamic ones
    .sort((a, b) => a > b ? -1 : 1)
    .map((path) => ({
      path: path
        // Remove /pages and .jsx extension
        .slice(6, -4)
        // Replace [id] with :id
        .replace(/\[(\w+)\]/, (_, m) => `:${m}`)
        // Replace '/index' with '/'
        .replace(/\/index$/, '/'),
      // The React component (default export)
      component: importMap[path].default,
      // The getServerSideProps individual export
      getServerSideProps: importMap[path].getServerSideProps,
    }))
}
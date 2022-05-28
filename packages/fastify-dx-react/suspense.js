
const suspense = new Map()

export function createFetchWithSuspense (path) {
  return function fetchWithSuspense (url) {
    const id = `${path}:${url}`
    const loader = suspense.get(id)
    // When fetchWithSuspense() is called the first time inside
    // a component, it'll create the resource object (loader) for
    // tracking its state, but the next time it's called, it'll
    // return the same resource object previously saved
    if (loader) {
      // Handle error, suspended state or return loaded data
      if (loader.error || loader.data?.statusCode === 500) {
        if (loader.data?.statusCode === 500) {
          throw new Error(loader.data.message)
        }
        throw loader.error
      }
      if (loader.suspended) {
        throw loader.promise
      }
      // Remove from suspense now that we have data
      suspense.delete(id)

      return loader.data
    } else {
      const loader = {
        suspended: true,
        error: null,
        data: null,
        promise: null,
      }
      loader.promise = fetch(`/json${id}`)
        .then((response) => response.json())
        .then((loaderData) => { loader.data = loaderData })
        .catch((loaderError) => { loader.error = loaderError })
        .finally(() => { loader.suspended = false })

      // Save the active suspended state to track it
      suspense.set(id, loader)

      // Call again for handling tracked state
      return fetchWithSuspense(path)
    }
  }
}

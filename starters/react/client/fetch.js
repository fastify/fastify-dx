// These methods are only used on the client, assuming the 
// requests are made to the current location, so no base 
// URL configuration is needed in this example.

export const JSONFetch = {
  get: makeJSONFetchMethod('get'),
  put: makeJSONFetchMethod('post'),
  put: makeJSONFetchMethod('put'),
  delete: makeJSONFetchMethod('delete'),
}

function makeJSONFetchMethod (method) {
  return (path, options) => fetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    ...options.json && {
      body: JSON.stringify(options.json),
    },
    ...options
  })
}

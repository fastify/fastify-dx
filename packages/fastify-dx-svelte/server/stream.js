
// Helper function to prepend and append chunks the body stream
export async function * generateHtmlStream ({ head, body, footer }) {
  yield head
  yield body
  yield footer()
}

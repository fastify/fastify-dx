
export default async () => {
  let state
  try {
    state = await import('/state.js')
  }
// Thin layer on top of fetch()
// to automatically perform JSON requests
import { JSONFetch } from '/fetch.js'

// This function runs exactly once on the server
// and once on the client during the first render,
// that is, it's not executed again in subsquent 
// client-side navigation via React Router.
export default (ctx) => {
  if (ctx.server) {
    ctx.state.todoList = ctx.server.db.todoList
  }
}

// State initializer, must be a function and must be 
// called state as this is a special context export and 
// needs special processing, e.g., in serializing and 
// hydrating state from the server
export const state = () => ({
  user: {
    authenticated: false,
  },
  todoList: null,
})

// Grouped actions that operate on the state. This export 
// could be named anything, no special processing involved.
export const actions = {
  authenticate (state) {
    state.user.authenticated = true
  },
  async addTodoItem (state, item) {
    await JSONFetch.put(`/api/todo/items`, {
      json: { item },
    })
    state.todoList.push(item)
  },
  async removeTodoItem (state, index) {
    await JSONFetch.delete(`/api/todo/items`, {
      json: { index },
    })
    state.todoList.splice(index, 1)
  }
}

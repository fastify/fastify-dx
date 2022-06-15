import ky from 'ky-universal'

export default (ctx) => {
  if (ctx.server) {
    ctx.state.todoList = ctx.server.db.todoList
  }
}

export const $fetch = ky.extend({
  prefixUrl: 'http://localhost:3000'
})

export const state = () => ({
  user: {
    authenticated: false,
  },
  todoList: null,
})

export const actions = {
  authenticate (state) {
    state.user.authenticated = true
  },
  async addTodoItem (state, item) {
    await $fetch.put('api/todo/items', {
      json: { item },
    })
    state.todoList.push(item)
  },
  async removeTodoItem (state, index) {
    await $fetch.delete('api/todo/items', {
      json: { index },
    })
    state.todoList.splice(index, 1)
  }
}

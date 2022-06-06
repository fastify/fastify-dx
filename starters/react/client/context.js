import ky from 'ky-universal'

export default (ctx) => {
  if (ctx.server) {
    ctx.state = ctx.server.db
  }
}

export const $fetch = ky.extend({
  prefixUrl: 'http://localhost:3000'
})

export const actions = {
  async addTodoListItem (state, item) {
    await $fetch.put('api/todo/items', {
      json: { item },
    })
    state.todoList.push(item)
  },
  async removeTodoListItem (state, index) {
    await $fetch.delete('api/todo/items', {
      json: { index },
    })
    state.todoList.splice(index, 1)
  }
}

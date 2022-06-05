import ky from 'ky-universal'

export default (ctx) => {
  if (ctx.server) {
    ctx.state = ctx.server.db
  }
}

export const $fetch = ky.extend({
  prefixUrl: 'http://localhost:3000'
})

export async function addTodoListItem ({ state, $fetch }, item) {
  await $fetch.put('api/todo/items', {
    body: { item },
  })
  state.todoList.push(item)
}

export async function removeTodoListItem ({ state, $fetch }, index) {
  await $fetch.delete('api/todo/items', {
    body: { index },
  })
  state.todoList.splice(index, 1)
}

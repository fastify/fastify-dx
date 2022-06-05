// import { $fetch } from 'ohmyfetch/undici'

export default (ctx) => {
  if (ctx.server) {
    ctx.state = ctx.server.db
  }
  // ctx.$fetch = $fetch.create({
  //   baseURL: 'http://localhost:3000',
  // })
}

// export function addTodoListItem ({ state, $fetch }, item) {
//   await $fetch('/api/todo/items', {
//     method: 'PUT',
//     body: { item },
//   })
//   state.todoList.push(item)
// }

// export async function removeTodoListItem ({ state, $fetch }, index) {
//   await $fetch('/api/todo/items', {
//     method: 'DELETE',
//     body: { index },
//   )
//   state.todoList.splice(index, 1)
// }

import ky from 'ky-universal'

interface User {
  authenticated: boolean | null
}

interface State {
  message: string | null
  user: User | null
  todoList: string[] | null
}

// This will eventually be provided by fastify-dx's core package
interface RouteContext {
  server?: any
  req?: any
  reply?: any
  actions: object
  data: any
  state: State
}

export default (ctx: RouteContext): void => {
  if (ctx.server) {
    ctx.state.todoList = ctx.server.db.todoList
  }
}

export const $fetch = ky.extend({
  prefixUrl: 'http://localhost:3000',
})

export const state = (): State => ({
  message: null,
  user: {
    authenticated: false,
  },
  todoList: null,
})

export const actions = {
  authenticate (state: State) {
    state.user.authenticated = true
  },
  async addTodoItem (state: State, item) {
    await $fetch.put('api/todo/items', {
      json: { item },
    })
    state.todoList.push(item)
  },
  async removeTodoItem (state: State, index) {
    await $fetch.delete('api/todo/items', {
      json: { index },
    })
    state.todoList.splice(index, 1)
  },
}

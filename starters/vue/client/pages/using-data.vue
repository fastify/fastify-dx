<template>
  <h2>Todo List — Using Data</h2>
  <ul>
    <li 
      v-for="(item, i) in state.todoList"
      :key="`item-${i}`">
      {{ item }}
    </li>
  </ul>
  <div>
    <input v-model="inputValue" />
    <button @click="addItem">Add</button>
  </div>
  <p>
    <Link to="/">Go back to the index</Link>
  </p>
  <p>⁂</p>
  <p>When you navigate away from this route, any additions to the to-do 
  list will be lost, because they're bound to this route component only.</p>
  <p>See the <Link to="/using-store">/using-store</Link> example to learn 
  how to use the application global state for it.
  </p>
</template>

<script>
import { useRouteContext } from '/dx:core.js'

export function getMeta () {
  return { title: 'Todo List — Using Data' }
}

export function getData ({ server }) {
	return {
		todoList: server.db.todoList
	}
}

export default {
  setup () {
    const {data} = useRouteContext()
    const addItem = async (value) => {
    }
    return { data, addItem }
  }
}
</script>

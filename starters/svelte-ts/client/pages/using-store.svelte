<script context="module">
export let getMeta = () => {
  return { title: 'Todo List — Using Store' }
}
</script>

<script>
import { Link } from 'svelte-routing'
import { useRouteContext } from '/dx:core.js'

let value = null

const { snapshot, state, actions } = useRouteContext()

const addItem = async () => {
  await actions.addTodoItem(state, value)
  value = ''
}
</script>

<h2>Todo List — Using Store</h2>
<ul>
  {#each $snapshot.todoList as item, i}
    <li>{item}</li>
  {/each}
  </ul>
<div>
  <input bind:value />
  <button on:click={addItem}>Add</button>
</div>
<p>
  <Link to="/">Go back to the index</Link>
</p>
<p>⁂</p>
<p>When you navigate away from this route, any additions to the to-do 
list are not lost, because they're bound to the global application state.</p>

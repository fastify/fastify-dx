import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRouteContext } from '/dx:router.jsx'
export { default as layout } from '/dx:layouts/auth.jsx'

export function getMeta () {
  return { title: 'Using Custom Layout' }
}

export default function Index (props) {
  const {snapshot, state, actions} = useRouteContext()
  const [input, setInput] = useState(null)
  const addItem = async (value) => {
    await actions.addTodoItem(state, value)
    input.value = ''
  }
  return (
    <>
      <h2>Todo List — Using Custom Layout</h2>
      <ul>{
        snapshot.todoList.map((item, i) => {
          return <li key={`item-${i}`}>{item}</li>
        })
      }</ul>
      <div>
        <input ref={setInput} />
        <button onClick={() => addItem(input.value)}>Add</button>
      </div>
      <p>
        <Link to="/">Go back to the index</Link>
      </p>
      <p>⁂</p>
      <p>When you navigate away from this route, any additions to the to-do 
      list are not lost, because they're bound to the global application state.</p>
    </>
  )
}

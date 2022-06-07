import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRouteContext } from '/dx:app.js'

export function getMeta () {
  return { title: 'Todo List — Using Store' }
}

export default function Index (props) {
  const {snapshot, state, actions} = useRouteContext()
  const [input, setInput] = useState(null)
  const addItem = async (value) => {
    await actions.addTodoListItem(state, value)
    input.value = ''
  }
  return (
    <>
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
        <Link to="/client-only">Go to another page</Link>
      </p>
    </>
  )
}

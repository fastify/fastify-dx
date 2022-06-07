import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRouteContext } from '/dx:app.js'

export function getMeta () {
  return { title: 'Todo List — Using Data' }
}

export function getData ({ server }) {
	return {
		todoList: server.db.todoList
	}
}

export default function Index (props) {
  const {data} = useRouteContext()
  const [todoList, updateTodoList] = useState(data.todoList)
  const [input, setInput] = useState(null)
  const addItem = async (value) => {
    updateTodoList(list => [...list, value])
    input.value = ''
  }
  return (
    <>
      <ul>{
        todoList.map((item, i) => {
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
    </>
  )
}

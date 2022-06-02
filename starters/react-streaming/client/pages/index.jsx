import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRouteContext } from '/context.jsx'

export function getData () {
  return {
    todoList: [
      'Do laundry',
      'Respond to emails',
      'Write report',
    ],
  }
}

export default function Index (props) {
  const { data } = useRouteContext()
  const [state, updateState] = useState(data.todoList)
  const [input, setInput] = useState(null)
  const addItem = (value) => {
    updateState((todoList) => [...todoList, value])
    input.value = ''
  }
  return (
    <>
      <ul>{
        state.map((item, i) => {
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

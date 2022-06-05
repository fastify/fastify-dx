import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSnapshot, useRouteContext } from '/dx:app'

export const meta = { title: 'Todo List' }

export default function Index (props) {
  console.log('!/1')
  const { state, snapshot } = useRouteContext()
  const [input, setInput] = useState(null)
  const addItem = (value) => {
    state.todoList.push(value)
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

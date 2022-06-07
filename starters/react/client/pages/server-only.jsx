import { Link } from 'react-router-dom'

export const serverOnly = true

export default function ServerOnly () {
  return (
    <>
      <p>This route is rendered on the server only!</p>
      <p>
        <Link to="/">Go back to the index</Link>
      </p>
    </>
  )
}

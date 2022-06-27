import { children } from 'solid-js'

export default function Default (props) {
  const c = children(() => props.children)
  return (
    <div class="contents">{c()}</div>
  )
}

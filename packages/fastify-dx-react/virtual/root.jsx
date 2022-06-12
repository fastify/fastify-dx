import 'virtual:uno.css'
import { DXApp } from '/dx:router.jsx'

export default function Root ({ url, serverInit }) {
  return <DXApp url={url} {...serverInit} />
}

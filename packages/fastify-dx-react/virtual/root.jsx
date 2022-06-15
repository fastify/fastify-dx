import { Suspense } from 'react'
import { DXApp } from '/dx:core.jsx'

export default function Root ({ url, serverInit }) {
  return (
    <Suspense>
      <DXApp url={url} {...serverInit} />
    </Suspense>
  )
}

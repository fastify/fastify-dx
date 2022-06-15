import { Suspense } from 'react'
import { DXApp } from '/dx:router.jsx'

export default function Root ({ url, serverInit }) {
  return (
    <Suspense>
      <DXApp url={url} {...serverInit} />
    </Suspense>
  )
}

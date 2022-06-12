import { Suspense } from 'react'

export default function Auth ({ children }) {
  return (
    <Suspense>
      {children}
    </Suspense>
  )
}

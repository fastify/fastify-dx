import { Suspense } from 'react'

export default function Auth ({ children }) {
  console.log('Switched to Auth layout!')
  return (
    <Suspense>
      {children}
    </Suspense>
  )
}

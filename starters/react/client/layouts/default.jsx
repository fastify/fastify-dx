import { Suspense } from 'react'

export default function Default ({ children }) {
  console.log('Switched to Default layout!')  
  return (
    <Suspense>
      {children}
    </Suspense>
  )
}

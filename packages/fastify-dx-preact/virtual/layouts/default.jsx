import { Suspense } from 'preact'

export default function Layout ({ children }) {
  return (
    <Suspense>
      {children}
    </Suspense>
  )
}

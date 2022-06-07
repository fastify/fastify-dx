import { BaseRouter, EnhancedRouter } from '/dx:router.jsx'
import Layout from '/dx:layout.jsx'

export default function Base ({ url, ...routerSettings }) {
  return (
    <BaseRouter location={url}>
      <Layout>
        <EnhancedRouter {...routerSettings} />
      </Layout>
    </BaseRouter>
  )
}

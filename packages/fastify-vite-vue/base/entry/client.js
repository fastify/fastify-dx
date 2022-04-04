import '/index.css'

import { createApp } from '/client'

createApp().then(async ({ app, router }) => {
  await router.isReady()
  app.mount('#app')
})

import '../index.css'
import { createApp } from './app'

createApp().then(async ({ app, router }) => {
  await router.isReady()
  app.mount('#app')
})

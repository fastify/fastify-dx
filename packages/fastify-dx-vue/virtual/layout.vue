<template>
  <component :is="layout">
    <slot />
  </component>
</template>

<script>
import { defineAsyncComponent, inject } from 'vue'
import { routeLayout } from '/dx:core.js'

const DefaultLayout = () => import('/dx:layouts/default.vue')
const appLayouts = import.meta.glob('/layouts/*.vue')

appLayouts['/layouts/default.vue'] ??= DefaultLayout

export default {
  setup: () => ({
    layout: inject(routeLayout)
  }),
  components: Object.fromEntries(
    Object.keys(appLayouts).map((path) => {
      const name = path.slice(9, -4)
      return [name, defineAsyncComponent(appLayouts[path])]
    })
  )
}
</script>

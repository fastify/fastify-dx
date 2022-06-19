<template>
  <component :is="name">
    <slot />
  </component>
</template>

<script>
import { defineAsyncComponent } from 'vue'

const DefaultLayout = () => import('/dx:layouts/default.vue')
const appLayouts = import.meta.glob('/layouts/*.vue')

appLayouts['/layouts/default.vue'] ??= DefaultLayout

export default {
  props: ['name'],
  components: Object.fromEntries(
    Object.keys(appLayouts).map((path) => {
      const name = path.slice(9, -4)
      return [name, defineAsyncComponent(appLayouts[path])]
    })
  )
}
</script>

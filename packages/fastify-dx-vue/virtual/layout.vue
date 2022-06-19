<template>
  <component :is="value" />
</template>

<script>
const DefaultLayout = () => import('/dx:layouts/default.vue')
const appLayouts = import.meta.glob('/layouts/*.vue')

appLayouts['/layouts/default.vue'] ??= DefaultLayout

export default {
  components: Object.fromEntries(
    Object.keys(appLayouts).map((path) => {
      const name = path.slice(9, -4)
      return [name, appLayouts[path]]
    }),
  )
}
</script>

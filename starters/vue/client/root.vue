<template>
  <router-view v-slot="{ Component }">
    <suspense>
      <component :is="Component"  />
    </suspense>
  </router-view>
</template>

<script>
import 'uno.css'
</script>

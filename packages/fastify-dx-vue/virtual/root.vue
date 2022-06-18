<template>
  <router-view v-slot="{ Component }">
    <suspense>
      <component
        :is="Component"
        :key="$route.path"
      />
    </suspense>
  </router-view>
</template>

<script>
import 'uno.css'
</script>

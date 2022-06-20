<script>
import 'uno.css'

export function configure (app) {
  // Extend Vue application instance here
}
</script>

<script setup>
import Layout from '/dx:layout.vue'
</script>

<template>
  <router-view v-slot="{ Component }">
    <Suspense>
      <Layout>
        <component
          :is="Component"
          :key="$route.path"
        />
      </Layout>
    </Suspense>
  </router-view>
</template>

<script>
import 'uno.css'
</script>

<script setup>
import Layout from '/dx:layout.vue'
import { useRouteContext } from '/dx:core.js'

const { layout } = useRouteContext()
</script>

<template>
  <router-view v-slot="{ Component }">
    <Suspense>
      <Layout :name="layout">
        <component
          :is="Component"
          :key="$route.path"
        />
      </Layout>
    </Suspense>
  </router-view>
</template>

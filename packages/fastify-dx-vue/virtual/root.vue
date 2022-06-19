<template>
  <router-view v-slot="{ Component }">
    <suspense>
      <Layout v-model="$route.layout">
        <component
          :is="Component"
          :key="$route.path"
        />
      </Layout>
    </suspense>
  </router-view>
</template>

<script>
import 'uno.css'
import Layout from '/dx:layout.vue'

export default { 
  components: { Layout },
}
</script>

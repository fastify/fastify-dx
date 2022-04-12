<template>
  <template v-if="error">
    <Error :error="error" />
  </template>
  <template v-else>
    <Layout />
  </template>
</template>

<script>
import { computed, onErrorCaptured } from 'vue'
import { useHead } from '@vueuse/head'
import { useIsomorphic } from './core.js'

import Layout from '../layout.vue'
import Error from '../error.vue'

import * as head from '../head.js'

export default {
  components: {
    Error,
    Layout,
  },
  setup() {
    const ctx = useIsomorphic()

    if (typeof head?.default === 'function') {
      useHead(head.default(ctx))
    } else {
      useHead(head.default ?? head)
    }

    onErrorCaptured((error) => {
      ctx.$error = error
    })

    return {
      error: computed(() => ctx.$error)
    }
  },
}
</script>

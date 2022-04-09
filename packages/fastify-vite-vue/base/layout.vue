<template>
	<router-view v-slot="{ Component }">
	  <Suspense @resolve="hydrationDone">
	  	<template #default>
	    	<component :key="$route.path" :is="Component" />
	    </template>
	  	<template #fallback>
	    	<Loader />
	    </template>
	  </Suspense>
	</router-view>
</template>

<script setup>
import Loader from './loader.vue'
import { hydrationDone } from '/entry/core'
</script>

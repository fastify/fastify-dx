<template>
	<Suspense>
		<Message />
		<template #fallback>
			<p>Waiting for content</p>
		</template>
	</Suspense>
</template>

<script>
import Message from '/components/Message.vue'

export const streaming = true

export default {
	components: { Message },
}
</script>
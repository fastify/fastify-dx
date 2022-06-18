<template>
	<Suspense>
		<Message />
		<template #fallback>
			<p>Waiting for content</p>
		</template>
	</Suspense>
</template>

<script>
export const streaming = true

export default {
	async setup () {
	  const message = await afterSeconds({
	  	message: 'Delayed by Suspense API',
	  	seconds: 5
	  })
		return { message }
	}
}

const delays = new Map()

function afterSeconds ({ message, seconds }) {
  return new Promise((resolve) => {
    setTimeout(() => {
    	resolve(message)
    }, seconds * 1000)
  })
}
</script>
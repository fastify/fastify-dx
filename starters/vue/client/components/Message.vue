<template>
	<p>{{message}}</p>
</template>

<script>
export default {
	async setup () {
	  const message = await afterSeconds({
	  	message: 'Delay with Suspense API',
	  	seconds: 5
	  })
		return { message }
	}
}

function afterSeconds ({ message, seconds }) {
  return new Promise((resolve) => {
    setTimeout(() => {
    	resolve(message)
    }, seconds * 1000)
  })
}
</script>
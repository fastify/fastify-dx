<template>
  <div class="contents">
    <template v-if="!state.user.authenticated">
      <p>This route needs authentication.</p>
      <button @click="authenticate">
        Click this button to authenticate.
      </button>
    </template>
    <slot v-else></slot>
  </div>
</template>

<script>
import { useRouteContext } from '/dx:core.js'

export default {
  setup () {
    const { actions, state } = useRouteContext()
    return {
      state,
      authenticate: () => actions.authenticate(state)
    }
  }
}
</script>

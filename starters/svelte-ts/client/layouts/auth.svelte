<script>
import { useRouteContext } from '/dx:core.js'
const { snapshot, actions, state } = useRouteContext()
</script>

<div class="contents">
  {#if !$snapshot.user.authenticated}
    <p>This route needs authentication.</p>
    <button on:click={() => actions.authenticate(state)}>
      Click this button to authenticate.
    </button>
  {:else}
  <slot />
  {/if}  
</div>

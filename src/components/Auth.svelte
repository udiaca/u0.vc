<script lang="ts">
  import { user } from '../utils/svelteStores'

  let authOk = false
  let tosOk = false
</script>

{#if !$user}
  <form method="post" action="/api/auth/github/authorize" disabled={!authOk}>
    <div>
      <label for="ack-set-cookie">I wish to authorize with GitHub.</label>
      <input id="ack-set-cookie" type="checkbox" bind:checked={tosOk} />
    </div>
    <div>
      <label for="ack-tos">I agree to the <a href="/en/terms_of_service">Terms of Service</a>.</label>
      <input id="ack-tos" type="checkbox" bind:checked={authOk} />
    </div>
    <input
      class="button"
      type="submit"
      value="GitHub OAuth2"
      disabled={!authOk || !tosOk}
    />
  </form>
  <style>
    .button {
      cursor: pointer;
    }
    .button:disabled {
      cursor: not-allowed;
    }
  </style>
{/if}

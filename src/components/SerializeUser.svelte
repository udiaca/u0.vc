<script lang="ts">
  import { user } from "../utils/svelteStores";
</script>

{#if $user}
<code><pre>{JSON.stringify($user, undefined, 2)}</pre></code>
<form method="post" action="/api/auth/logout">
  <input type="submit" value="Logout" />
</form>

{:else}
  <code>user data invisible acknowledged</code>
{/if}

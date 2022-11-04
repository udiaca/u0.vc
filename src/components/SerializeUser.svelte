<script lang="ts">
  import { user } from "../utils/svelteStores";

  const [uId, _userData] = $user;
  const link = `/u/${uId}`
</script>

{#if $user}
<div class="public-container">
  <a href={link}>Public</a>
</div>

<code><pre>{JSON.stringify($user, undefined, 2)}</pre></code>
<form method="post" action="/api/auth/logout">
  <input type="submit" value="Logout" />
</form>

{:else}
  <code>user data invisible acknowledged</code>
{/if}

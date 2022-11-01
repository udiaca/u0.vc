<script lang="ts">
  import { user } from "../utils/stores/user";
</script>

{#if $user}
<code><pre>{JSON.stringify($user, undefined, 2)}</pre></code>
{:else}
  <code>user data invisible acknowledged</code>
{/if}

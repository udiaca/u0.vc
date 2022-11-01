<script lang="ts">
  import { user } from "../utils/stores/user";

  let authOk = false;
</script>

{#if $user}
<div>
  <a href="/user">User</a>
  <form method="post" action="/api/auth/logout">
    <input type="submit" value="Logout" />
  </form>
</div>
{:else}
  <form method="post" action="/api/auth/github/authorize" disabled={!authOk}>
    <div>
      <label for="ack-set-cookie">
        I wish to authorize with GitHub.
      </label>
    <input id="ack-set-cookie" type="checkbox" bind:checked={authOk} />
    </div>
    <input class="button" type="submit" value="GitHub OAuth2" disabled={!authOk} />
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

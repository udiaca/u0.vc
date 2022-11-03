<script lang="ts">
  import { user as svelteUser } from "../utils/svelteStores";

  export let user: any;

  if (user && user.github) {
    svelteUser.set(user)
  }
</script>

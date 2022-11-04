<script lang="ts">
  import { user as svelteUser } from "../utils/svelteStores";

  export let user: any;

  if (user) {
    svelteUser.set(user)
  }
</script>

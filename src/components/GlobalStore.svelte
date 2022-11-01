<script lang="ts">
  import { setUser } from "../utils/stores/user";

  export let user: any;

  if (user && user.github) {
    setUser(user)
  }
</script>

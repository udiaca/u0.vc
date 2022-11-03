<script lang="ts">
  import { onMount } from 'svelte';
  import { user } from '../utils/svelteStores'

  let visibility: string = 'hidden';
  let innerHeight: number = 0;
  let authUserElement: HTMLDivElement | undefined;
  let lastY: number = -1;
  let y: number = -1;
  let unbrokenScrollDown: number = 0;
  let unbrokenScrollUp: number = 0;

  const showAuthUser = () => {
    if (authUserElement) {
      authUserElement.style.removeProperty("opacity");
      authUserElement.classList.remove("hidden");
    }
  }

  const hideAuthUser = () => {
    if (authUserElement) {
      authUserElement.style.setProperty("opacity", "0");
      authUserElement.classList.add("hidden");
    }
  }

  onMount(() => {
    if ($user) {
      visibility = 'visible'
    }
  })

  $: {
    if (lastY >= 0) {
      const scrollDownAmt = y - lastY;
      if (scrollDownAmt > 0) {
        unbrokenScrollDown += scrollDownAmt;
        unbrokenScrollUp = 0;
      } else {
        unbrokenScrollUp += -scrollDownAmt;
        unbrokenScrollDown = 0;
      }
    }

    if (unbrokenScrollDown > (innerHeight / 4)) {
      hideAuthUser();
    }
    if (unbrokenScrollUp > 0 || y <= 0) {
      showAuthUser();
    }
    lastY = y
  }
</script>
<svelte:window bind:scrollY={y} bind:innerHeight={innerHeight} />
<div bind:this={authUserElement} id="auth-user" style="--auth-user-visibility: {visibility}">
  <div>
    <a href="/user">User</a>
  </div>
</div>
<style>
  #auth-user {
    margin: 0;
    padding: 0;
    visibility: var(--auth-user-visibility);
    position: fixed;
    top: 1em;
    right: 1em;
    border: 1px dashed var(--emph-color);
    transition: opacity 1s ease;
  }
</style>
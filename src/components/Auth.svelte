<script lang="ts">
  import { onMount } from 'svelte'
  import { user } from '../utils/svelteStores'

  export let randomStringFromServer: string

  let authOk = false
  let tosOk = false
  $: navigatorCredentials = false;

  onMount(() => {
    navigatorCredentials = navigator && !!navigator.credentials;
  })

  let credentialPromise = new Promise(() => {});
  $: {
    // https://webauthn.guide/#webauthn-api
    if (navigatorCredentials) {
      credentialPromise = navigator.credentials.create({
        publicKey: {
          challenge: Uint8Array.from(randomStringFromServer, (c) =>
            c.charCodeAt(0)
          ),
          rp: {
            name: 'Udia Systems',
            id: window.location.host,
          },
          user: {
            id: Uint8Array.from('UZSL85T9AFC', (c) => c.charCodeAt(0)),
            name: 'lee@webauthn.guide',
            displayName: 'Lee',
          },
          pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
          authenticatorSelection: {
            authenticatorAttachment: 'cross-platform',
          },
          timeout: 60000,
          attestation: 'direct',
        },
      })
    }
  }


</script>

<h1>{navigatorCredentials}</h1>

{#await credentialPromise}
  <p>...waiting</p>
{:then credential}
  <p>{credential}</p>
{:catch error}
  <p>{error}</p>
{/await}
{#if !$user}
  <form method="post" action="/api/auth/github/authorize" disabled={!authOk}>
    <div>
      <label for="ack-set-cookie">I wish to authorize with GitHub.</label>
      <input id="ack-set-cookie" type="checkbox" bind:checked={tosOk} />
    </div>
    <div>
      <label for="ack-tos"
        >I agree to the <a href="/en/terms_of_service">Terms of Service</a
        >.</label
      >
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

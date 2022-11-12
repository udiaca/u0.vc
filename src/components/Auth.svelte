<script lang="ts">
  import { onMount } from 'svelte'
  import { user } from '../utils/svelteStores'
  import Radio from './Radio.svelte'

  export let randomStringFromServer: string

  let authOk = false
  let tosOk = false
  let navigatorCredentials = false
  let authValue: string | undefined = undefined
  let options = [
    {
      value: 'webauthn',
      label: 'Web Authentication',
    },
    {
      value: 'github',
      label: 'GitHub',
    },
  ]
  let credentialPromise = new Promise(() => {})

  let userId = 'UZSL85T9AFC'
  let userName = 'lee@webauthn.guide'
  let userDisplayName = 'Lee'

  let disabled = false
  const handleWebAuthnClick = () => {
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
          id: Uint8Array.from(userId, (c) => c.charCodeAt(0)),
          name: userName,
          displayName: userDisplayName,
        },
        pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
        authenticatorSelection: {
          authenticatorAttachment: 'cross-platform',
        },
        timeout: 60000,
        attestation: 'direct',
      },
    })
    disabled = true
  }

  onMount(() => {
    navigatorCredentials = navigator && !!navigator.credentials
    // https://webauthn.guide/#webauthn-api
    if (!navigatorCredentials) {
      options = [
        {
          value: 'github',
          label: 'GitHub',
        },
      ]
    }
  })
</script>

{#if !$user}
  <div class:agreed={tosOk}>
    <label for="ack-tos"
      >I agree to the <a href="/en/terms_of_service">Terms of Service</a
      >.</label
    >
    <input id="ack-tos" type="checkbox" bind:checked={tosOk} />
    {#if tosOk}
      <Radio {options} legend="Authorize with" bind:userSelected={authValue} />
      {#if authValue == 'github'}
        <form
          method="post"
          action="/api/auth/github/authorize"
          disabled={!authOk}
        >
          <input class="button" type="submit" value="GitHub OAuth2" />
        </form>
      {:else if authValue == 'webauthn'}
        <div>
          <label for="user-id">User ID</label>
          <input id="user-id" type="text" bind:value={userId} />
        </div>
        <div>
          <label for="user-name">User Name</label>
          <input id="user-name" type="text" bind:value={userName} />
        </div>
        <div>
          <label for="display-name">Display Name</label>
          <input id="display-name" type="text" bind:value={userDisplayName} />
        </div>

        {#await credentialPromise}
          <p>...waiting</p>
        {:then credential}
          <p>{credential}</p>
        {:catch error}
          <p>{error}</p>
        {/await}

        <button on:click={handleWebAuthnClick} {disabled}> Authenticate </button>
      {/if}
    {/if}
  </div>
  <style>
    .button {
      cursor: pointer;
    }
    .button:disabled {
      cursor: not-allowed;
    }

    .agreed {
      border-style: dotted;
      border-color: var(--emph-color);
      padding: 0.2em;
    }
  </style>
{/if}

<script lang='ts'>
import { understanding } from '../../utils/svelteStores';
</script>

{#if $understanding === 'UDIA'}
  <p>UDIA</p>
{:else if $understanding === 'UDIa'}
  <p><a href="/author">/author</a></p>
{:else if $understanding === 'UDiA'}
  <p><a href="/identity">/identity</a></p>
{:else if $understanding === 'UdIA'}
  <p><a href="/deployments">/deployments</a></p>
{:else if $understanding === 'uDIA'}
  <p><a href="/">/udia</a></p>
{:else if $understanding === 'udia'}
  <h3>Only select <strong>1</strong></h3>
{:else if $understanding.toUpperCase() === 'UDIA'}
  <p><code>TODO: not implemented yet</code></p>
{:else if $understanding}
  <p>Not quite...</p>
{:else}
  <pre> </pre>
{/if}
<input bind:value={$understanding} size=4 maxlength=4 />
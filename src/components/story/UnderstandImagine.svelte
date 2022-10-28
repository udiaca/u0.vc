<script lang='ts'>
import { understanding } from '../../utils/stores';

let understandingValue: string;
understanding.subscribe(value => understandingValue = value)
</script>

{#if understandingValue === 'UDIA'}
  <p>UDIA</p>
{:else if understandingValue === 'UDIa'}
  <p><a href="/author">/author</a></p>
{:else if understandingValue === 'UDiA'}
  <p><a href="/identity">/identity</a></p>
{:else if understandingValue === 'UdIA'}
  <p><a href="/todo">/todo</a></p>
{:else if understandingValue === 'uDIA'}
  <p><a href="/">/udia</a></p>
{:else if understandingValue === 'udia'}
  <h3>Only select <strong>1</strong></h3>
{:else if understandingValue.toUpperCase() === 'UDIA'}
  <p><code>TODO: not implemented yet</code></p>
{:else if understandingValue}
  <p>Not quite...</p>
{:else}
  <pre> </pre>
{/if}
<input bind:value={$understanding} size=4 maxlength=4 />
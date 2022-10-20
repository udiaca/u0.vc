<script lang='ts'>
export let understanding:string = ""
</script>

{#if understanding === 'UDIA'}
  <p>UDIA</p>
{:else if understanding === 'UDIa'}
  <p><a href="/author">/author</a></p>
{:else if understanding === 'UDiA'}
  <!-- make this more fun, go to another thing -->
  <p>Congratuations, you've understood!</p>
{:else if understanding === 'UdIA'}
  <p><a href="/identity">/identity</a></p>
{:else if understanding === 'uDIA'}
  <p><a href="/">/udia</a></p>
{:else if understanding === 'udia'}
  <h3>Only select <strong>1</strong></h3>
{:else if understanding.toUpperCase() === 'UDIA'}
  <code>TODO: not implemented yet</code>
{:else if understanding}
  <p>Not quite...</p>
{/if}
<input bind:value={understanding} />
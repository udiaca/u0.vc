<script>
  let timer;
  let results = null;
  let loading = false;

  let value;

  const fetchEntrySearch = async (query) => {
    try {
      const searchParams = new URLSearchParams({q: query}).toString()
      // local fetch not working with d1 binding
      // https://discord.com/channels/595317990191398933/992060581832032316/1048810875898843238
      // const resp = await fetch(`/api/entry?${searchParams}`)
      loading = true;
      const resp = await fetch(`https://u0.vc/api/entry?${searchParams}`)
      const payload = await resp.json()
      const { results: _results, meta } = payload;
      results = _results
      console.debug(JSON.stringify({query, meta, payload}))
    } catch {

    } finally {
      loading = false;
    }

  }

  const debounce = v => {
    value = v
    clearTimeout(timer);
    timer = setTimeout(async () => {
      await fetchEntrySearch(v)
    }, 750);
  }
</script>

{#if results !== null}
  {#each results as result}
    <a href={result.url}>
      <code>{JSON.stringify(result.content)}</code>
    </a>
  {/each}
{/if}

{#if results === null}
  <pre><code>{results}</code></pre>
{:else if results.length <= 0}
  <div>
    <p>I wish to contribute to UDIA: <code>{value}</code></p>
    <ul>
      <li><a href="https://github.com/udiaca/u0.vc">Source Code (GitHub)</a></li>
    </ul>
  </div>
{/if}

{#if timer}
  <code>active</code>
{/if}

{#if loading}
  <code>fetching {value}</code>
{/if}

<input on:keyup={({ target }) => {
  if (target) {
    const { value } = target;
    debounce(value)
  }
}} />

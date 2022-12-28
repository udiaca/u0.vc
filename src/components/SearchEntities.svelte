<script>
  import { fetchTimeoutWithRetries } from '../utils/fetchTimeout'

  let timer
  let results = null
  let loading = false
  let error = null

  let value

  const fetchEntrySearch = async (query) => {
    try {
      error = null
      const searchParams = new URLSearchParams({ q: query }).toString()
      // local fetch not working with d1 binding
      // https://discord.com/channels/595317990191398933/992060581832032316/1048810875898843238
      // const resp = await fetch(`/api/entry?${searchParams}`)
      loading = true
      const resp = await fetchTimeoutWithRetries(`https://u0.vc/api/entry?${searchParams}`, undefined, [10000, 20000, 60000])
      const payload = await resp.json()
      const { results: _results, meta } = payload
      results = _results
    } catch (err) {
      error = err
    } finally {
      loading = false
    }
  }

  const debounce = (v) => {
    value = v
    clearTimeout(timer)
    timer = setTimeout(async () => {
      await fetchEntrySearch(v)
      timer = undefined
    }, 750)
  }
</script>

{#if results}
  <div>
    {#each results as result}
      <div class="search-result">
        <a href={result.url}>
          <code>{result.url}</code>
          <p>{JSON.stringify(result.content)}</p>
        </a>
      </div>
    {/each}
  </div>
{/if}

{#if !results}
  <pre><code>{results}</code></pre>
{:else if results.length <= 0}
  <div>
    <p>I wish to contribute to UDIA: <code>{value}</code></p>
    <ul>
      <li>
        <a href="https://github.com/udiaca/u0.vc">Source Code (GitHub)</a>
      </li>
    </ul>
  </div>
{/if}

{#if timer}
  <code>active</code>
{/if}

{#if loading}
  <code>fetching {value}</code>
{/if}

{#if error}
  <code>{error}</code>
{/if}

<input
  placeholder="Search"
  on:keyup={({ target }) => {
    if (target) {
      const { value } = target
      debounce(value)
    }
  }}
/>

<style>
  .search-result {
    padding: 0.5em 0;
  }
  .search-result:not(:last-child) {
    border-bottom: 1px dashed var(--emph-color);
  }
  .search-result p {
    margin: 0;
    padding-bottom: 0.5em;
  }
</style>

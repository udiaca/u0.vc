<script lang="ts">
  import { onMount } from 'svelte'
  import u from '../../i18n/en/u-adjective-positive'
  import d from '../../i18n/en/d-noun-time_sensative'
  import i from '../../i18n/en/i-verb-ing-conveying'
  import a from '../../i18n/en/a-positive'
  import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter'

  /*
  // adjective, starts with U, indicates positive sentiment
  u,
  // noun, starts with D, indicates time sensitive entity
  d,
  // verb-ing, starts with I, to bring attention to time sensitive entity
  i,
  // wildcard (noun, verb), starts with A
  a
  */

  /**
   * Every 4 seconds, change one word, at random.
   */
  let counter: number = 0

  const getRandIdx = (arr: readonly any[], lastIdx: number = -1) => {
    let newIdx = Math.floor(Math.random() * arr.length)
    while (newIdx === lastIdx) {
      newIdx = Math.floor(Math.random() * arr.length)
    }

    return newIdx
  }

  let uIdx = getRandIdx(u)
  let dIdx = getRandIdx(d)
  let iIdx = getRandIdx(i)
  let aIdx = getRandIdx(a)
  let wordIdx = 0
  onMount(() => {
    const interval = setInterval(() => {
      counter = (counter + 1) % 4

      if (counter === 0) {
        wordIdx = (wordIdx + 1) % 4
        switch (wordIdx) {
          case 0:
            uIdx = getRandIdx(u, uIdx)
            break
          case 1:
            dIdx = getRandIdx(d, dIdx)
            break
          case 2:
            iIdx = getRandIdx(i, iIdx)
            break
          case 3:
            aIdx = getRandIdx(a, aIdx)
            break
          default:
            break
        }
      }
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  })
</script>

<div id="banner">
  <h1 id="u" class:emphasized={wordIdx === 0}>
    {capitalizeFirstLetter(u[uIdx])}
  </h1>
  <h1 id="d" class:emphasized={wordIdx === 1}>
    {capitalizeFirstLetter(d[dIdx])}
  </h1>
  <h1 id="i" class:emphasized={wordIdx === 2}>
    {capitalizeFirstLetter(i[iIdx])}
  </h1>
  <h1 id="a" class:emphasized={wordIdx === 3}>
    {capitalizeFirstLetter(a[aIdx])}
  </h1>
</div>

<style>
  #banner {
    margin-top: 1rem;
    align-self: center;
  }
  h1 {
    margin: 0;
    color: var(--color);
    transition: color 800ms ease-out;
  }
  .emphasized {
    color: var(--emph-color);
  }
</style>

<script>
  let timer;

  const fetchEntrySearch = async (query) => {
    const searchParams = new URLSearchParams({q: query}).toString()
    // local fetch not working with d1 binding
    // https://discord.com/channels/595317990191398933/992060581832032316/1048810875898843238
    // const resp = await fetch(`/api/entry?${searchParams}`)
    const resp = await fetch(`https://u0.vc/api/entry?${searchParams}`)
    console.log('==== resp', resp)
  }

  const debounce = v => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const result = await fetchEntrySearch(v)
      console.log(result)
    }, 750);
  }
</script>

<div>

</div>
<input on:keyup={({ target }) => {
  if (target) {
    const { value } = target;
    debounce(value)
  }
}} />

<script>
  let timer;

  const fetchEntrySearch = async (query) => {
    const searchParams = new URLSearchParams({q: query}).toString()
    await fetch(`/api/entry?${searchParams}`)
  }

  const debounce = v => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const result = await fetchEntrySearch(v)
      console.log(result)
    }, 750);
  }
</script>

<input on:keyup={({ target }) => {
  if (target) {
    const { value } = target;
    debounce(value)
  }
}} />

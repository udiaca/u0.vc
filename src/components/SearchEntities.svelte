<script>
  let val = '';
  let timer;

  const debounce = v => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      val = v;
    }, 750);
  }
</script>

<input on:keyup={({ target }) => {
  if (target) {
    const { value } = target;
    debounce(value)
  }
}} />
{val}
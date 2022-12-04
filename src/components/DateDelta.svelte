<script lang="ts">
  import { onDestroy } from 'svelte'
  import { getRelativeTimeString } from '../utils/getRelativeTimeString'
  import Tooltip from "./Tooltip.svelte";

  export let locales: string[];
  export let toDelta: Date;
  export let intlDTFOpts: Intl.DateTimeFormatOptions | undefined = {
    dateStyle: 'full',
    timeStyle: 'long'
  };

  function onInterval(callback: () => void, milliseconds: number) {
    const interval = setInterval(callback, milliseconds)

    onDestroy(() => {
      clearInterval(interval)
    })
  }

  const intlDTF = new Intl.DateTimeFormat(locales, intlDTFOpts).format(toDelta);

  let deltaMSec: number
  let localizedDeltaDate: string

  const tickTime = () => {
    try {
      deltaMSec = toDelta.getTime() - Date.now();
      localizedDeltaDate = getRelativeTimeString(deltaMSec, locales);
    } catch (err) {
      console.error(err);
    }
  }

  tickTime()
  onInterval(tickTime, 1000)
</script>
<Tooltip
  text={localizedDeltaDate}
  tooltipText={intlDTF}
/>

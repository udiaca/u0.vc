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

  const intlDTF = new Intl.DateTimeFormat(locales, intlDTFOpts)
  let tooltipText = ""
  if (!isNaN(toDelta.valueOf())) {
    tooltipText = intlDTF.format(toDelta);
  }

  let deltaMSec = 0
  let localizedDeltaDate = ""

  const tickTime = () => {
    try {
      if (isNaN(toDelta.valueOf())) {
        // date is not valid, return
        return
      }
      deltaMSec = toDelta.getTime() - Date.now();
      if (deltaMSec != 0) {
        localizedDeltaDate = getRelativeTimeString(deltaMSec, locales);
      }
    } catch (err) {
      console.error(err);
    }
  }

  tickTime()
  onInterval(tickTime, 1000)
</script>
<Tooltip
  text={localizedDeltaDate}
  tooltipText={tooltipText}
/>

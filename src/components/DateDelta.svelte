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

  let deltaMSec = toDelta.getTime() - Date.now();
  let localizedDeltaDate = getRelativeTimeString(deltaMSec, locales);

  onInterval(() => {
    deltaMSec = toDelta.getTime() - Date.now();
    localizedDeltaDate = getRelativeTimeString(deltaMSec, locales);
  }, 1000)
</script>
<Tooltip
  text={localizedDeltaDate}
  tooltipText={intlDTF}
/>

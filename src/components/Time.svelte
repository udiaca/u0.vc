<script lang='ts'>
  import { onDestroy } from "svelte"

  // utility functions
  const capitalizeFirstLetter = (word: string) => word.charAt(0).toLocaleUpperCase(locale || defaultLocales) + word.slice(1)
  const displayNameOrCapitalize = (input: string, type: Intl.DisplayNamesOptions['type']) => {
    try {
      return new Intl.DisplayNames(locale || defaultLocales, { type }).of(input)
    } catch {
      return capitalizeFirstLetter(input) + " *"
    }
  }
  const supportedValuesOf = (input: string) => {
    try {
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/supportedValuesOf
      if (typeof (Intl as any).supportedValuesOf !== 'undefined') {
        return (Intl as any).supportedValuesOf(input);
      }
    } catch {}
    return undefined
  }

  // types and constants
  type Locales = string | string[] | undefined
  type DateTimeStyle = "full" | "long" | "medium" | "short" | undefined;
  type Calendar = string | "buddhist" | "chinese" | "coptic" | "dangi" | "ethioaa" | "ethiopic" | "gregory" | "hebrew" | "indian" | "islamic" | "islamic-umalqura" | "islamic-tbla" | "islamic-civil" | "islamic-rgsa" | "iso8601" | "japanese" | "persian" | "roc" | undefined
  type NumberingSystem = string | "arab" | "arabext" | "bali" | "beng" | "deva" | "fullwide" | " gujr" | "guru" | "hanidec" | "khmr" | " knda" | "laoo" | "latn" | "limb" | "mlym" | "mong" | "mymr" | "orya" | "tamldec" | "telu" | "thai" | "tibt" | undefined
  const dateTimeStyleChoices: DateTimeStyle[] = ["full", "long", "medium", "short", undefined]
  const timeZoneChoices: string[] = supportedValuesOf("timeZone") || []
  const calendarChoices: Calendar[] = supportedValuesOf("calendar") || ["buddhist", "chinese", "coptic", "dangi", "ethioaa", "ethiopic", "gregory", "hebrew", "indian", "islamic", "islamic-umalqura", "islamic-tbla", "islamic-civil", "islamic-rgsa", "iso8601", "japanese", "persian", "roc", undefined]
  const numberingSystemChoices: NumberingSystem[] = supportedValuesOf("numberingSystem") || ["arab", "arabext", "bali", "beng", "deva", "fullwide", " gujr", "guru", "hanidec", "khmr", " knda", "laoo", "latn", "limb", "mlym", "mong", "mymr", "orya", "tamldec", "telu", "thai", "tibt", undefined]

  // props
  export let defaultLocales: Locales
  const defaultOptions = Intl.DateTimeFormat(defaultLocales).resolvedOptions();
  export let dateStyle: DateTimeStyle = defaultOptions.dateStyle || "full";
  export let timeStyle: DateTimeStyle = defaultOptions.timeStyle || "long"
  export let calendar: Calendar = defaultOptions.calendar as Calendar
  export let numberingSystem: NumberingSystem = defaultOptions.numberingSystem as NumberingSystem
  export let timeZone: string = defaultOptions.timeZone
  export let showGoBackDelayMs: number = 5000

  $: getFormattedTime = (intlLocale: Locales, toFormat: Date) => {
    try {
      return [new Intl.DateTimeFormat(intlLocale, {
        dateStyle,
        timeStyle,
        calendar,
        numberingSystem,
        timeZone,
      }).format(toFormat), null]
    } catch (err) {
      return [toFormat.toISOString(), err];
    }
  }


  // DateTimeFormat locales and options
  $: locale = ""
  const localePlaceholder = new Intl.ListFormat(locale || defaultLocales, { style: 'short', type: 'disjunction' }).format(defaultLocales)

  // form options
  const dateTimeStyleOptions = dateTimeStyleChoices.map((dateTimeStyleChoice) => (
    { id: dateTimeStyleChoice, text: dateTimeStyleChoice ? capitalizeFirstLetter(dateTimeStyleChoice) : '--' }
  ))

  const calendarOptions = calendarChoices.map((calendarChoice) => (
    { id: calendarChoice, text: calendarChoice ? displayNameOrCapitalize(calendarChoice, "calendar") : '--'}
  ))

  const numberingSystemOptions = numberingSystemChoices.map((numberingSystemChoice) => (
    { id: numberingSystemChoice, text: numberingSystemChoice ? displayNameOrCapitalize(numberingSystemChoice, "script") : '--'}
  ))

  $: [formattedTime, error] = getFormattedTime(locale || defaultLocales, new Date());

  const interval = setInterval(() => {
    [formattedTime, error] = getFormattedTime(locale || defaultLocales, new Date());
  }, 1000)

  let showGoBack = false;
  const goBackInterval = setInterval(() => {
    showGoBack = true;
  }, showGoBackDelayMs)

  onDestroy(() => {
    clearInterval(goBackInterval)
    clearInterval(interval)
  })
</script>

<div id="clock">
  <h1>{formattedTime}</h1>
  {#if error}
  <pre><code>{error}</code></pre>
  {/if}
</div>
<details>
  <summary>Configuration</summary>
  <label for="locale">Locale:</label><br>
  <input
    type="text"
    id="locale"
    name="locale"
    bind:value={locale}
    placeholder={localePlaceholder}
  /><br>

  <label for="dateStyle">Date Style:</label><br>
  <select name="dateStyle" bind:value={dateStyle}>
    {#each dateTimeStyleOptions as dateTimeStyleOption}
      <option value={dateTimeStyleOption.id}>
        {dateTimeStyleOption.text}
      </option>
    {/each}
  </select><br>

  <label for="timeStyle">Time Style:</label><br>
  <select name="timeStyle" bind:value={timeStyle}>
    {#each dateTimeStyleOptions as dateTimeStyleOption}
      <option value={dateTimeStyleOption.id}>
        {dateTimeStyleOption.text}
      </option>
    {/each}
  </select><br>

  <label for="calendar">Calendar:</label><br>
  {#if calendarOptions.length === 0}
    <input
      type="text"
      id="calendar"
      name="calendar"
      bind:value={calendar}
    />
  {:else}
    <select name="calendar" bind:value={calendar}>
      {#each calendarOptions as calendarOption}
        <option value={calendarOption.id}>
          {calendarOption.text}
        </option>
      {/each}
    </select>
  {/if}
  <br>

  <label for="numberingSystem">Numbering System:</label><br>
  {#if numberingSystemChoices.length === 0}
    <input
      type="text"
      id="numberingSystem"
      name="numberingSystem"
      bind:value={numberingSystem}
    />
  {:else}
    <select name="numberingSystem" bind:value={numberingSystem}>
      {#each numberingSystemOptions as numberingSystemOption}
        <option value={numberingSystemOption.id}>
          {numberingSystemOption.text}
        </option>
      {/each}
    </select>
  {/if}
  <br>

  <label for="timeZone">Time Zone:</label><br>
  {#if timeZoneChoices.length === 0}
    <input
      type="text"
      id="timeZone"
      name="timeZone"
      bind:value={timeZone}
    />
  {:else}
    <select name="timeZone" bind:value={timeZone}>
      {#each timeZoneChoices as timeZoneChoice}
        <option value={timeZoneChoice}>
          {timeZoneChoice}
        </option>
      {/each}
    </select>
  {/if}
  <br>
</details>
{#if showGoBack}
<a id="go-back" href="/">Go Back</a>
{/if}
<style>
  a#go-back {
    font-size: 10vh;
    transition-property: font-size;
    transition-duration: 4s;
  }
  a#go-back:hover {
    font-size: 1px;
  }
</style>
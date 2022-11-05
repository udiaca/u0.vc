/**
 * Using the Intl API, convert a number (milliseconds) into a human readable
 * duration string.
 * @param {number} deltaMs change in time, measured in milliseconds
 * @param locales Intl API compatible locales
 * @param options Intl.RelativeTimeFormat compatible options
 * @returns 
 */
export const getRelativeTimeString = (
  deltaMs: number,
  locales?: string | string[] | undefined,
  options?: Intl.RelativeTimeFormatOptions | undefined
) => {
  // TODO: this function would do well with some unit tests.

  const intlRTF = new Intl.RelativeTimeFormat(locales, {
    localeMatcher: 'best fit',
    numeric: 'auto',
    style: 'long',
    ...(options || {}),
  })

  // 1 if we are looking towards future, -1 if we are looking towards past.
  const posNeg = deltaMs >= 0 ? 1 : -1
  let runDeltaSec = Math.floor(deltaMs / 1000)
  const deltaDays = posNeg * Math.floor(Math.abs(runDeltaSec) / 86400)
  runDeltaSec = runDeltaSec % 86400
  const deltaHours = posNeg * Math.floor(Math.abs(runDeltaSec) / 3600)
  runDeltaSec = runDeltaSec % 3600
  const deltaMinutes = posNeg * Math.floor(Math.abs(runDeltaSec) / 60)
  const deltaSeconds = runDeltaSec % 60

  const parts: Intl.RelativeTimeFormatPart[][] = []

  if (deltaDays !== 0) {
    const formatDeltaDays = intlRTF.formatToParts(deltaDays, 'day')
    parts.push(formatDeltaDays)
  }

  if (deltaHours !== 0) {
    const formatDeltaHours = intlRTF.formatToParts(deltaHours, 'hour')
    parts.push(formatDeltaHours)
  }

  if (deltaMinutes !== 0) {
    const formatDeltaMinutes = intlRTF.formatToParts(deltaMinutes, 'minute')
    parts.push(formatDeltaMinutes)
  }

  const formatDeltaSeconds = intlRTF.formatToParts(deltaSeconds, 'second')
  parts.push(formatDeltaSeconds)

  // don't want to have "<days> days ago, <hours> hours ago, <minutes> minutes ago"
  // want to have "<days> days, <hours> hours, <minutes> minutes ago"
  const formattedParts = parts.map((rtfParts, index) =>
    rtfParts
      .map((rtfPart, rtfPartIndex) => {
        if (rtfPart.type === 'integer') {
          return rtfPart.value
        }
        if (rtfPart.type === 'literal' && posNeg < 0) {
          if (index < parts.length - 1) {
            return rtfPart.value.split(' ').filter((val) => Boolean(val))[0]
          }
          return rtfPart.value
        }
        if (rtfPart.type === 'literal' && posNeg > 0) {
          if (index === 0 || rtfPartIndex !== 0) {
            return rtfPart.value
          }
          if (index !== 0 && rtfPartIndex === 0) {
            return ''
          }
        }
        return JSON.stringify(rtfPart)
      })
      .filter((rtfPart) => Boolean(rtfPart))
      .join(' ')
  )

  const intlLF = new Intl.ListFormat(locales, {
    style: 'long',
    type: 'conjunction',
  })

  return intlLF.format(formattedParts)
}

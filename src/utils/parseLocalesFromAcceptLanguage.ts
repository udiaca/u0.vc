/**
 * Given an 'accept-language' header, parse out a list of locales.
 * @param {string} inp - e.g. 'en-CA,en-US;q=0.7,en;q=0.3'
 * @returns {string[]} - e.g. ['en-CA', 'en-US', 'en']
 */
export const parseLocalesFromAcceptLanguage = (inp: string): string[] =>
  inp // 'en-CA,en-US;q=0.7,en;q=0.3'
    .split(',') // [ 'en-CA', 'en-US;q=0.7', 'en;q=0.3' ]
    .map((rawLang) => rawLang.split(';')[0] || '') // [ 'en-CA', 'en-US', 'en' ]
    .filter(locale => Boolean(locale))
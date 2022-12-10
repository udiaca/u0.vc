/**
 * Utility function to abort a fetch.
 * @param {RequestInfo | URL} input
 * @param {RequestInit} init
 * @param {number} timeoutMs defaults to 5 seconds
 * @returns {Promise<Response>} response from the fetch request
 */
export const fetchTimeout = (input: RequestInfo | URL, init: RequestInit | undefined = undefined, timeoutMs = 5000) => {
  // https://developer.mozilla.org/en-US/docs/Web/API/AbortController
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  const opts = init ? init : {}
  return fetch(input, { ...opts, signal: controller.signal }).finally(() => {
    clearTimeout(timeoutId);
  })
}
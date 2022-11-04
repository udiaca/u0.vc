/**
 * The inputs into `DONamespace.idFromString` must be strings of 64 hex digits
 * @param inp variable to check ID validity
 * @returns true if is a valid DO ID String, false otherwise
 */
export const isValidDurableObjectIdString = (inp: any) => {
  return Boolean(typeof inp === 'string' &&
    inp.match(/^[0-9a-f]{64}$/))
}
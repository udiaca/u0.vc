export const parseCookie = (str: string): Record<string, string> =>
  (str.indexOf(';') >= 0 ? str.split(';') : [str])
    .map((v) => v.split('='))
    .filter((v) => v.length === 2)
    .reduce((acc, v) => {
      const [rawKey, rawValue] = v;
      const key = decodeURIComponent((rawKey || "").trim())
      const value = decodeURIComponent((rawValue || "").trim())
      acc[key] = value
      return acc
    }, {} as Record<string, string>)

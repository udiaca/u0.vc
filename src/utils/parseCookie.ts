export const parseCookie = (str: string): any =>
  (str.indexOf(';') >= 0 ? str.split(';') : [str,])
    .map(v => v.split('='))
    .filter(v => v.length === 2)
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {} as Record<string, string>);

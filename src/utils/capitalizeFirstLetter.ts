export const capitalizeFirstLetter = (word?: string): string =>
  word ? word.charAt(0).toLocaleUpperCase() + word.slice(1): ''

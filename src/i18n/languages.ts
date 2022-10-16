/**
 * BCP 47 supported site language tags
 */
export const languageTags = ["en"];

const languages = Object.fromEntries(
  languageTags.map((tag) => {
    const displayNames = new Intl.DisplayNames([tag], { type: "language" });
    const displayName = displayNames.of(tag) || "";
    const capitalized =
      displayName.charAt(0).toLocaleUpperCase() + displayName.slice(1);
    return [tag, capitalized];
  })
);

export default languages;

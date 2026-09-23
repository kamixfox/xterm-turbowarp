export function setTheme(args) {
  if (!terminal) return;

  const themeName = String(args.THEME || "atom-one-dark");
  terminal.options.theme = getThemeColors(themeName);
}
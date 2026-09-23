export function writeToTerminal(args) {
  if (!terminal) return;

  terminal.write(getIndent() + String(args.TEXT || ""));
}

export function writeLineToTerminal(args) {
  if (!terminal) return;

  terminal.write(getIndent() + String(args.TEXT || "") + "\r\n");
}
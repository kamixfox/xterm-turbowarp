export function promptUser(args) {
  return new Promise((resolve) => {
    if (!terminal) {
      resolve("");
      return;
    }

    const promptText = String(args.TEXT || "");
    if (promptText) {
      terminal.write(getIndent() + promptText);
    }

    terminal.options.cursorBlink = true;
    terminal.options.disableStdin = false;
    terminal.focus();

    activePrompt = {
      buffer: "",
      resolve: (val) => {
        activePrompt = null;
        terminal.options.cursorBlink = false;
        terminal.options.disableStdin = true;
        resolve(val);
      },
    };
  });
}
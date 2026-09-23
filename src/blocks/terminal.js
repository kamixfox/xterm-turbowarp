export async function initializeTerminal() {
  if (terminal) return;

  try {
    await loadScripts();
    setupContainer();

    terminal = new window.Terminal({
      cursorBlink: false,
      disableStdin: true,
      convertEol: true,
      fontFamily: "monospace",
      fontSize: 14,
      theme: getThemeColors("atom-one-dark"),
    });

    fitAddon = new window.FitAddon.FitAddon();
    terminal.loadAddon(fitAddon);

    terminal.open(container);
    setTimeout(() => fitAddon.fit(), 50);

    terminal.onData((data) => {
      if (!activePrompt) return;

      const char = data;
      if (char === "\r") {
        terminal.write("\r\n");
        activePrompt.resolve(activePrompt.buffer);
      } else if (char === "\x7F") {
        if (activePrompt.buffer.length > 0) {
          activePrompt.buffer = activePrompt.buffer.slice(0, -1);
          terminal.write("\b \b");
        }
      } else {
        activePrompt.buffer += char;
        terminal.write(char);
      }
    });

    window.addEventListener("resize", () => {
      if (isVisible && fitAddon) {
        setTimeout(() => fitAddon.fit(), 50);
      }
    });
  } catch (e) {
    console.error("XtermExtension: Failed to load or initialize Xterm.js", e);
  }
}

export function showTerminal() {
  if (container && terminal) {
    container.style.display = "block";
    isVisible = true;
    setTimeout(() => {
      fitAddon.fit();
      terminal.focus();
    }, 10);
  }
}

export function hideTerminal() {
  if (container) {
    container.style.display = "none";
    isVisible = false;
  }
}

export function clearTerminal() {
  if (terminal) {
    terminal.clear();
    indentLevel = 0;
  }
}
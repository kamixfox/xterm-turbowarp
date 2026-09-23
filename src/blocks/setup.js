export function setup() {
  const ANSI = {
    RESET: "\x1b[0m",
    BOLD: "\x1b[1m",
    DIM: "\x1b[2m",
    RED: "\x1b[31m",
    GREEN: "\x1b[32m",
    YELLOW: "\x1b[33m",
    BLUE: "\x1b[34m",
    MAGENTA: "\x1b[35m",
    CYAN: "\x1b[36m",
    WHITE: "\x1b[37m",
    GRAY: "\x1b[90m",
    RED_BG: "\x1b[41m",
    WHITE_BOLD: "\x1b[1;37m",
  };

  const LEVELS = {
    info: { icon: "ℹ", color: ANSI.BLUE, label: "info" },
    success: { icon: "✔", color: ANSI.GREEN, label: "success" },
    warn: { icon: "⚠", color: ANSI.YELLOW, label: "warn" },
    error: { icon: "✖", color: ANSI.RED, label: "error" },
    debug: { icon: "⚙", color: ANSI.MAGENTA, label: "debug" },
    start: { icon: "▶", color: ANSI.CYAN, label: "start" },
    trace: { icon: "›", color: ANSI.GRAY, label: "trace" },
    fatal: { icon: "✕", color: ANSI.WHITE_BOLD + ANSI.RED_BG, label: "fatal" },
  };

  const THEMES = {
    "atom-one-dark": {
      background: "#282c34",
      foreground: "#abb2bf",
      cursor: "#528bff",
      black: "#3f4451",
      red: "#e06c75",
      green: "#98c379",
      yellow: "#e5c07b",
      blue: "#61afef",
      magenta: "#c678dd",
      cyan: "#56b6c2",
      white: "#d19a66",
      brightBlack: "#5c6370",
      brightRed: "#e06c75",
      brightGreen: "#98c379",
      brightYellow: "#e5c07b",
      brightBlue: "#61afef",
      brightMagenta: "#c678dd",
      brightCyan: "#56b6c2",
      brightWhite: "#ffffff",
    },
    "atom-one-light": {
      background: "#fafafa",
      foreground: "#383a42",
      cursor: "#526fff",
      black: "#a0a1a7",
      red: "#e45649",
      green: "#50a14f",
      yellow: "#c18401",
      blue: "#4078f2",
      magenta: "#a626a4",
      cyan: "#0184bc",
      white: "#383a42",
      brightBlack: "#a0a1a7",
      brightRed: "#e45649",
      brightGreen: "#50a14f",
      brightYellow: "#c18401",
      brightBlue: "#4078f2",
      brightMagenta: "#a626a4",
      brightCyan: "#0184bc",
      brightWhite: "#fafafa",
    },
    dracula: {
      background: "#282a36",
      foreground: "#f8f8f2",
      cursor: "#f8f8f2",
      black: "#000000",
      red: "#ff5555",
      green: "#50fa7b",
      yellow: "#f1fa8c",
      blue: "#bd93f9",
      magenta: "#ff79c6",
      cyan: "#8be9fd",
      white: "#bfbfbf",
      brightBlack: "#4d4d4d",
      brightRed: "#ff6e67",
      brightGreen: "#5af78e",
      brightYellow: "#f4f99d",
      brightBlue: "#caa9fa",
      brightMagenta: "#ff92d0",
      brightCyan: "#9aedfe",
      brightWhite: "#e6e6e6",
    },
    solarized: {
      background: "#002b36",
      foreground: "#839496",
      cursor: "#93a1a1",
      black: "#073642",
      red: "#dc322f",
      green: "#859900",
      yellow: "#b58900",
      blue: "#268bd2",
      magenta: "#d33682",
      cyan: "#2aa198",
      white: "#eee8d5",
    },
  };

  const MAX_LABEL_WIDTH = Math.max(...Object.values(LEVELS).map((level) => level.label.length));
  const PAD = "  ";

  const defaultStyles = {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "#282c34",
    zIndex: "100",
    display: "none",
    overflow: "hidden",
  };

  let terminal = null;
  let fitAddon = null;
  let container = null;
  let isVisible = false;
  let timestampsEnabled = false;
  let indentLevel = 0;
  let activePrompt = null;
  let activeLevelFilters = null;
  let activeScopeFilters = null;

  function loadScripts() {
    if (window.Terminal && window.FitAddon) return Promise.resolve();

    return new Promise((resolve, reject) => {
      if (!document.getElementById("xterm-ext-css")) {
        const style = document.createElement("style");
        style.id = "xterm-ext-css";
        const css = `.xterm-viewport::-webkit-scrollbar { display: none !important; } .xterm-viewport { -ms-overflow-style: none !important; scrollbar-width: none !important; }`;
        style.innerHTML = css;
        document.head.appendChild(style);
      }

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/xterm@5.3.0/css/xterm.css";
      document.head.appendChild(link);

      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/xterm@5.3.0/lib/xterm.js";
      script.onload = () => {
        const fitScript = document.createElement("script");
        fitScript.src = "https://cdn.jsdelivr.net/npm/xterm-addon-fit@0.8.0/lib/xterm-addon-fit.js";
        fitScript.onload = resolve;
        fitScript.onerror = reject;
        document.head.appendChild(fitScript);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function setupContainer() {
    if (container) return;

    const canvas =
      (Scratch.vm &&
        Scratch.vm.runtime &&
        Scratch.vm.runtime.renderer &&
        Scratch.vm.runtime.renderer.canvas) ||
      document.querySelector("canvas");

    if (!canvas) {
      console.error("XtermExtension: Could not find Scratch canvas.");
      return;
    }

    const stage = canvas.parentElement;

    container = document.createElement("div");
    Object.assign(container.style, defaultStyles);

    if (getComputedStyle(stage).position === "static") {
      stage.style.position = "relative";
    }

    stage.appendChild(container);
  }

  function getIndent() {
    return PAD.repeat(Math.max(0, indentLevel));
  }

  function getThemeColors(themeName) {
    return THEMES[themeName] || THEMES["atom-one-dark"];
  }
}
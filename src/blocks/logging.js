export function logMessage(args) {
  if (!terminal) return;

  const levelName = String(args.LEVEL || "info");
  const rawScope = String(args.SCOPE || "").trim();
  const text = String(args.TEXT || "");

  if (activeLevelFilters && !activeLevelFilters.includes(levelName)) return;

  const config = LEVELS[levelName] || { icon: "?", color: ANSI.GRAY, label: levelName };
  const scope = rawScope ? getIndent() + rawScope : "";
  const scopeText = rawScope ? `\x1b[2m • ${scope}\x1b[0m` : "";

  if (activeScopeFilters && !activeScopeFilters.includes("*") && !activeScopeFilters.includes(rawScope)) {
    return;
  }

  const label = config.label.padEnd(MAX_LABEL_WIDTH).toUpperCase();
  const timestamp = timestampsEnabled ? `[${new Date().toLocaleTimeString()}] ` : "";
  const line = `${timestamp}\x1b[1m\x1b[44m${label}\x1b[0m ${config.icon} ${config.color}${text}\x1b[0m${scopeText}\r\n`;

  terminal.write(line);
}

export function setLogLevelFilter(args) {
  const levels =
    String(args.LEVELS || "*")
      .split(",")
      .map((level) => level.trim())
      .filter((level) => level !== "") || [];
  activeLevelFilters = levels.length > 0 ? levels : ["*"];
}

export function setLogScopeFilter(args) {
  const scopes =
    String(args.SCOPES || "*")
      .split(",")
      .map((scope) => scope.trim())
      .filter((scope) => scope !== "") || [];
  activeScopeFilters = scopes.length > 0 ? scopes : ["*"];
}

export function clearLogFilters() {
  activeLevelFilters = null;
  activeScopeFilters = null;
}

export function setTimestamps(args) {
  timestampsEnabled = String(args.STATE || "off") === "on";
}

export function boxText(args) {
  if (!terminal) return;

  const text = String(args.TEXT || "").trim();
  const width = Math.min(Math.max(text.length, 10), 40);
  const box = `┌${"─".repeat(width + 2)}┐\r\n│ ${text.padEnd(width)} │\r\n└${"─".repeat(width + 2)}┘`;

  terminal.write(`\x1b[48;2;255;250;205m${box}\x1b[0m\r\n`);
}

export function divider() {
  if (!terminal) return;

  const total = terminal.cols || 80;
  terminal.write(`\r\n${"─".repeat(Math.max(0, total))}\r\n`);
}

export function dividerLabeled(args) {
  if (!terminal) return;

  const text = String(args.TEXT || "").trim();
  const total = terminal.cols || 80;
  const label = `\x1b[1m${text.toUpperCase()}\x1b[0m`;
  const dashLength = Math.max(0, total - label.length - 4);

  terminal.write(`\r\n${"  "}${label} ${"─".repeat(dashLength)}\r\n`);
}
import { initializeTerminal, showTerminal, hideTerminal, clearTerminal } from "./blocks/terminal.js";
import { promptUser } from "./blocks/prompt.js";
import {
  logMessage,
  setLogLevelFilter,
  setLogScopeFilter,
  clearLogFilters,
  setTimestamps,
  boxText,
  divider,
  dividerLabeled,
} from "./blocks/logging.js";
import { writeToTerminal, writeLineToTerminal } from "./blocks/write.js";
import { setTheme } from "./blocks/theme.js";
import { setup } from "./blocks/setup.js";

export const blocks = {
  initializeTerminal,
  showTerminal,
  hideTerminal,
  clearTerminal,
  promptUser,
  logMessage,
  setLogLevelFilter,
  setLogScopeFilter,
  clearLogFilters,
  setTimestamps,
  boxText,
  divider,
  dividerLabeled,
  writeToTerminal,
  writeLineToTerminal,
  setTheme,
};

export { setup };
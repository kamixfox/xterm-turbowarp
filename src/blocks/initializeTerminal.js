export function initializeTerminal() {
  return init().catch((err) => {
    console.error("Xterm: failed to initialize the terminal.", err);
  });
}

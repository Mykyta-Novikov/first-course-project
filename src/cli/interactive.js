let { command } = require("./commands");
let readline = require("readline");

/**
 * Encapsulates context of session on CLI's interactive mode, including server address and possible net.Socket.
 */
class InteractiveContext {
  constructor(port, host) {
    this.port = port;
    this.host = host;
    this.connection = null;
  }
}

/**
 * Sets CLI to interactive mode and prevents exiting process until SIGINT (Ctrl+C) received.
 * @param {string} commandArguments Is not used.
 * @param {{host: string, port: string}} globalArguments Contains port and host to set up InteractiveContext.
 */
function startInteractiveMode(commandArguments, globalArguments) {
  let context = new InteractiveContext(
    globalArguments.port.values[0],
    globalArguments.host.values[0]
  );

  process.stdout.write(`${context.host}:${context.port}> `);

  let stdin = readline.createInterface(process.stdin);
  stdin.addListener("line", (input) => {
    command(input, null, context, (hadError) =>
      process.stdout.write(
        `${!hadError ? "Disconnected from " : ""}${context.host}:${
          context.port
        }> `
      )
    );
  });
  stdin.addListener("SIGINT", () => stdin.removeAllListeners());
}

module.exports = {
  interactive: startInteractiveMode,
};

let childProcess = require("child_process");
let { interactive } = require("./interactive");

/**
 * Enum of command's parameters.
 * @enum
 */
const defaultParameters = {
  /**
   * Do not go into interactive mode after starting the server.
   */
  "no-interactive": false,
};

/**
 * Starts server in another process, and goes into interactive mode, unless no-interactive is set.
 * @param commandArguments Contains commands parameters.
 * @param {{host: string, port: string}} globalArguments Contains host and port to set up server.
 */
function startServer(commandArguments, globalArguments) {
  let parameters = defaultParameters;
  commandArguments.forEach((argument) => {
    if (parameters[argument] === undefined)
      throw new Error(`Unknown argument: ${argument}`);
    parameters[argument] = true;
  });

  let child = childProcess.fork(__dirname + "/../server/");

  child.addListener("spawn", () =>
    child.send(
      JSON.stringify({
        port: globalArguments.port.values[0],
        host: globalArguments.host.values[0],
      })
    )
  );
  let loadingListener = (message) => {
    if (message === "loaded") {
      child.removeListener("message", loadingListener);

      console.log(
        `Server started at ${globalArguments.host.values[0]}:${globalArguments.port.values[0]}`
      );
      if (!parameters["no-interactive"]) interactive("", globalArguments);
    } else if (message.startsWith("error:"))
      throw new Error("Server not started: " + message.slice(6));
  };
  child.addListener("message", loadingListener);
}

module.exports = {
  start: startServer,
};

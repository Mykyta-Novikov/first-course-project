let RESP = require("./../resp");
let net = require("net");

/**
 * Sends command to the server and receives and prints response. net.Socket which is used is determined
 * according to the following order: interactiveContext.connection, created from data in interactiveContext,
 * created from data in globalArguments.
 * @param {string} commandArguments String that contains server command and is sent to server.
 * @param {{host: string, port: string}} globalArguments Parsed arguments. Are used to get host and port to create net.Socket.
 * @param {InteractiveContext} interactiveContext Contains port and host to create net.Socket.
 * @param {net.Socket} interactiveContext.connection May contain already created and connected socket to use.
 * @param {function} afterWrite Callback invoked after writing server response.
 */
function processCommand(
  commandArguments,
  globalArguments,
  interactiveContext,
  afterWrite
) {
  let connection;
  if (
    interactiveContext &&
    interactiveContext.connection &&
    interactiveContext.connection.readyState === "open"
  )
    connection = interactiveContext.connection;
  else if (interactiveContext) {
    if (interactiveContext.connection) interactiveContext.connection.end();
    interactiveContext.connection = connection = net.createConnection(
      interactiveContext.port,
      interactiveContext.host
    );
  } else
    connection = net.createConnection(
      globalArguments.port.values[0],
      globalArguments.host.values[0]
    );

  if (connection.readyState === "open")
    connection.write(RESP.encode(RESP.command(commandArguments)));
  else {
    connection.addListener("connect", () =>
      connection.write(RESP.encode(RESP.command(commandArguments)))
    );
    if (interactiveContext) interactiveContext.connection = null;
  }

  connection.addListener("error", (err) => {
    console.error(err);
    afterWrite(false);
  });
  connection.addListener("data", (data) => {
    console.log(RESP.parse(data.toString()).join(" "));
    if (afterWrite) afterWrite(true);

    if (!interactiveContext) connection.end();
  });
}

module.exports = {
  command: processCommand,
};

let net = require("net");
let { serverListener } = require("./listener");
let RESP = require("./../resp");

let server = net.createServer();

if (!process.send)
  throw new Error("Server process should be spawned with an with ICP channel.");

let messageDataListener = (message) => {
  process.removeListener("message", messageDataListener);
  let messageData;
  try {
    messageData = JSON.parse(message);
    if (!messageData.port || !messageData.host) {
      // noinspection ExceptionCaughtLocallyJS
      throw new Error(
        `Impossible to start server: port=${messageData.port} host=${messageData.host}`
      );
    }
  } catch (e) {
    process.send("error:" + RESP.encode(e));
    throw e;
  }

  server.addListener("listening", () => process.send("loaded"));
  server.addListener("connection", serverListener);

  server.listen(messageData.port, messageData.host);
};
process.once("message", messageDataListener);

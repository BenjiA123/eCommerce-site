process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION  Exiting...");
  console.log(err.name, err.message, err);
  process.exit(1);
});
/**
 * Module dependencies.
 */
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
var app = require("./app");
var debug = require("debug")("ecommerce:server");
var http = require("http");
const mongoose = require("mongoose");

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database ");
    // console.log(process.env);
  })
  .catch((err) => {
    console.log(err);
  });

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  console.log("Server listening on " + addr.port);
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection  Exiting...");
  console.log(err.name, err.message, err);

  server.close(() => {
    process.exit(1);
  });
});

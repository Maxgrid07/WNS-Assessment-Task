/**
 * Main application file
 */

"use strict";

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || "development";

var express = require("express");
var mongoose = require("mongoose");
var config = require("./config/environment");

// Connect to database
mongoose.connect(
  config.mongo.uri,
  config.mongo.options
);

mongoose.connection.on("connected", function() {
  console.log("Mongoose default connection open to " + config.mongo.uri);
});

mongoose.connection.on("error", function(err) {
  console.error("MongoDB connection error: " + err);
  process.exit(-1);
});

mongoose.connection.on("disconnected", function() {
  console.log("Mongoose default connection disconnected");
});

// Populate DB with sample data
if (config.seedDB) {
  require("./config/seed");
}

// Setup server
var app = express();
var server = require("http").createServer(app);
require("./config/express")(app);
require("./routes")(app);

// Start server
server.listen(config.port, config.ip, function() {
  console.log(
    "Express server listening on %d, in %s mode",
    config.port,
    app.get("env")
  );
});

process.on("SIGINT", function() {
  console.log("Shutting Down...");
  mongoose.connection.close(function() {
    console.log(
      "Mongoose default connection disconnected through app termination"
    );
    server.close();
    process.exit(-1);
  });
});

// Expose app
exports = module.exports = app;

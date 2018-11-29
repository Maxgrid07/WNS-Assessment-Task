/**
 * Express configuration
 */

"use strict";

var express = require("express");
var favicon = require("serve-favicon");
var morgan = require("morgan");
var compression = require("compression");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var cookieParser = require("cookie-parser");
var errorHandler = require("errorhandler");
var path = require("path");
var config = require("./environment");
var passport = require("passport");
var session = require("express-session");
var mongoStore = require("connect-mongo")(session);

module.exports = function(app) {
  var env = app.get("env");

  // app.use(express.static("server/uploads"));
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize());

  // Persist sessions with mongoStore
  // We need to enable sessions for passport twitter because its an oauth 1.0 strategy
  app.use(
    session({
      secret: config.secrets.session,
      cookie: {
        expires: new Date(Date.now() + 26280000000)
      },
      resave: true,
      saveUninitialized: true
      // store: new mongoStore({
      //   mongooseConnection: config.mongo.uri,
      //   db: "wns"
      // })
    })
  );

  if ("development" === env) {
    // Add headers
    app.use(function(req, res, next) {
      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      res.setHeader("Access-Control-Allow-Credentials", true);

      // Pass to next layer of middleware
      next();
    });
    app.use(express.static(path.join(config.root, ".tmp")));
    app.use(express.static(path.join(config.root, "client")));
    app.set("appPath", path.join(config.root, "client"));
    app.use(morgan("dev"));
    app.use(errorHandler()); // Error handler - has to be last

    app.head("*", function(req, res, next) {
      res.status(501).end();
    });
    app.all("*", function(req, res, next) {
      res.setHeader("Last-Modified", new Date().toUTCString());
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
      res.header(
        "Access-Control-Allow-Headers",
        "Content-type,Accept,X-Access-Token,X-Key"
      );
      res.header("X-Frame-Options", "SAMEORIGIN");
      res.setHeader("Expires", new Date(Date.now() + 86400000).toISOString());
      res.setHeader("Cache-Control", "private, max-age=2592000");
      if (req.method == "OPTIONS") {
        res.status(200).end();
      } else {
        next();
      }
    });
  }
};

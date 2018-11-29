"use strict";
var config = require("../config/environment");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
var compose = require("composable-middleware");
var User = require("../api/user/user.model");
var validateJwt = expressJwt({ secret: config.secrets.session });

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
  return (
    compose()
      // Validate session
      .use(function(req, res, next) {
        if (req.cookies && req.cookies.token) {
          try {
            req.headers.authorization = "Bearer " + req.cookies.token;
          } catch (exc) {
            return next(exc);
          }
        }
        if (req.headers.authorization) {
          validateJwt(req, res, next);
        } else {
          return res.status(401).send("UnauthorizedError");
        }
      })
      // Attach user to request
      .use(function(req, res, next) {
        User.findById(req.user._id, function(err, user) {
          if (err) return next(err);
          if (!user) return res.status(401).json({ message: "Unauthorized" });

          req.user = user;
          next();
        });
      })
      .use(function(err, req, res, next) {
        if (err.name === "UnauthorizedError") {
          var e = [];
          e.push(err);
          return res.status(401).send(e);
        }
      })
  );
}

function signToken(id) {
  return jwt.sign({ _id: id }, config.secrets.session, {
    expiresIn: 60 * 60 * 5
  });
}

exports.isAuthenticated = isAuthenticated;
exports.signToken = signToken;

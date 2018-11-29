"use strict";

var User = require("./user.model");

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  console.log(req.user);
  var userId = req.user._id;
  User.findOne({ _id: userId }, "-salt -hashedPassword", function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).send("Unauthorized");
    }
    addNoCacheHeader(res);
    return res.status(200).json(user);
  });
};

exports.logout = function(req, res) {
  res.clearCookie("token");
  res.redirect("/");
};

function addNoCacheHeader(res) {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
}

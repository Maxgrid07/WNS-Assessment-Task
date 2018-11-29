(function() {
  "use strict";

  var fs = require("fs");
  var path = require("path");
  var csvjson = require("csvjson");
  var toObject = csvjson.stream.toObject();
  var stringify = csvjson.stream.stringify();

  exports.getAlcoholConsumption = function(req, res) {
    var filePath = path.join(__dirname, "../../../sample/alcohol.csv");
    fs.createReadStream(filePath)
      .pipe(toObject)
      .pipe(stringify)
      .pipe(res);
  };
  exports.getAllAvengers = function(req, res) {
    var filePath = path.join(__dirname, "../../../sample/avengers.csv");
    fs.createReadStream(filePath)
      .pipe(toObject)
      .pipe(stringify)
      .pipe(res);
  };
})();

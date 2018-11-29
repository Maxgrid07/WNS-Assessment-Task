/**
 * API to read CSV file from disk and modify the contents through streams and writes data to file
 */
(function() {
  "use strict";

  var fs = require("fs");
  var path = require("path");
  var csvjson = require("csvjson");
  var toObject = csvjson.stream.toObject();
  var stringify = csvjson.stream.stringify();
  var INPUT_FILE_PATH = path.join(__dirname, "../../../sample/alcohol.csv");
  var OUTPUT_FILE_PATH = path.join(__dirname, "../../output/output.json");

  // Expose function
  module.exports = {
    init: init
  };

  // Reads CSV and transform into JSON object
  function init(req, res) {
    var ws = fs.createWriteStream(OUTPUT_FILE_PATH);
    fs.createReadStream(INPUT_FILE_PATH)
      .pipe(toObject)
      .pipe(stringify)
      .pipe(ws);
    ws.on("finish", function() {
      return res.send("File processed successfully!");
    });
  }
})();

"use strict";

var fs = require("fs");
var path = require("path");
var csvjson = require("csvjson");
var INPUT_FILE_PATH = path.join(__dirname, "../../../sample/avengers.csv");
var AvengerModel = require("./avengers.model");

exports.create = function(req, res) {
  fs.readFile(INPUT_FILE_PATH, "utf8", function(err, csv) {
    if (err) {
      throw err;
    }
    var data = csvjson.toObject(csv, {
      headers: "url,name,appearances,year,gender",
      delimiter: ",",
      quote: '"'
    });
    data = data.slice(1, data.length + 1);
    AvengerModel.insertMany(data, function(err, docs) {
      if (err) {
        return res.send(err);
      }
      return res.status(200).json(docs);
    });
  });
};

exports.get = function(req, res) {
  var query = {};
  if (req.query.gender) {
    query = AvengerModel.aggregate([
      {
        $group: { _id: "$gender", count: { $sum: 1 } }
      }
    ]);
  } else {
    query = AvengerModel.find();
  }
  query.exec(function(err, aggrDocs) {
    if (err) {
      return res.send(err);
    }
    return res.status(200).json(aggrDocs);
  });
};

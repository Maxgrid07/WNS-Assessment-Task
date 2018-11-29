'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AvengerSchema = new Schema({
  url: String,
  name: String,
  appearances: String,
  gender: String,
  year: String
});

module.exports = mongoose.model('Avenger', AvengerSchema);
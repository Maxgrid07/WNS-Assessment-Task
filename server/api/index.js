'use strict';

var express = require('express');
var ChartCtrl = require('./chart/chart.controller');
var AvengerCtrl = require('./avenger/avengers.controller');
var auth = require('../auth/auth.service');

var router = express.Router();

router.get('/charts/alcohol', auth.isAuthenticated(), ChartCtrl.getAlcoholConsumption);
router.get('/charts/avengers', auth.isAuthenticated(), ChartCtrl.getAllAvengers);

router.get('/avengers', auth.isAuthenticated(), AvengerCtrl.get);
router.post('/avengers', AvengerCtrl.create);

module.exports = router;
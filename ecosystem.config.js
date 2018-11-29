'use strict';

var path = require('path');
process.env.PORT = 3000;

module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [{
    name: "WNS",
    script: path.join("./server/app.js"),
    env: {
      "PORT": process.env.PORT,
      "NODE_ENV": "development",
      "OPENSHIFT_MONGODB_DB_URL": 'mongodb://localhost/wns'
    },
    "exec_mode": "fork",
    "instances": 1,
    "log_date_format": "YYYY-MM-DD HH:mm Z"
  }]
}
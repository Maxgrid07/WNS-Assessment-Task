/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');

User.find(function (err, data) {
  if(data.length < 1){
    User.create({
      provider: 'local',
      name: 'Test User',
      email: 'test@test.com',
      password: '123'
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@admin.com',
      password: '123'
    }, function() {
        console.log('finished populating users');
    });
  }
});

// (function() {
//   var fs = require('fs');
//   var path = require('path');
//   var filePath = path.join(__dirname, "./output.json");
//   fs.readFile(filePath, 'utf8', function(err, data) {
//     if(err) {
//       console.log(err);
//     }
//     console.log(data);
//   });
// })();
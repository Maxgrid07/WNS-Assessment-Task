'use strict';

// Development specific configuration
// ==================================
module.exports = {
  
  // MongoDB connection options
  mongo: {
    uri: process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/wns'
  },
  seedDB: true

};

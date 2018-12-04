'use strict';

// Development specific configuration
// ==================================
module.exports = {
  
  // MongoDB connection options
  mongo: {
    uri: process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://admin:admin123@ds155492.mlab.com:55492/wns'
  },
  seedDB: true

};

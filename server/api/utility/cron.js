(function() {
  "use strict";
  var util = require("../utility/fs_stream");
  var TIME_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Scheduled for given time interval to read CSV file from disk and writes back to JSON file
   */
  module.exports = {
    init: init
  };

  function init() {
    util.init();
    return setTimeout(function() {
      init();
    }, TIME_INTERVAL);
  }
})();

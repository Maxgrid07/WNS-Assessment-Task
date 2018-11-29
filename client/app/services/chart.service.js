(function() {
  "use strict";

  angular.module("app").factory("Chart", function($http, $httpParamSerializer) {
    var svc = {};

    svc.getAlcoholConsumption = function() {
      var url = "/api/charts/alcohol";
      return $http
        .get(url)
        .then(function(res) {
          return res.data;
        })
        .catch(function(err) {
          throw err;
        });
    };

    svc.getAvengers = function(filter) {
      var queryParams = "";
      var url = "/api/avengers";
      if(filter) {
        queryParams = $httpParamSerializer(filter);
        url = url + "?" + queryParams;
      }
      return $http
        .get(url)
        .then(function(res) {
          return res.data;
        })
        .catch(function(err) {
          throw err;
        });
    };

    return svc;
  });
})();

/* ============================================================
 * File: main.js
 * Main Controller to set global scope variables.
 * ============================================================ */

angular
  .module("app")
  .controller("AppCtrl", function(
    $rootScope,
    $scope,
    $state,
    $window,
    $location,
    Auth
  ) {
    $scope.$on("userLogout", function() {
      console.log("Event Emitted..!");
      $scope.logout();
    });

    // Log-in user.
    $scope.user = {};
    $scope.login = function(form) {
      // if (form.$valid) {
      Auth.login({
        email: $scope.user.email,
        password: $scope.user.password
      })
        .then(function(data) {
          $scope.user = Auth.getCurrentUser();
          $state.go("home");
        })
        .catch(function(err) {
          $scope.error = err.message;
          alert($scope.error);
        });
      // }
    };

    // Logout user.
    $scope.logout = function() {
      Auth.logout()
        .then(function() {
          $scope.user = Auth.getCurrentUser();
          // $location.path("/");
          $state.go("/");
        })
        .catch(function(err) {
          $scope.error = err.message;
        });
    };
  })
  .factory("authInterceptor", function(
    $q,
    $cookieStore,
    $location
  ) {
    return {
      // Add authorization token to headers
      request: function(config) {
        config.headers = config.headers || {};
        if ($cookieStore.get("token")) {
          config.headers.Authorization = "Bearer " + $cookieStore.get("token");
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if (response.status === 401) {
          $location.path("/");
          // remove any stale tokens
          $cookieStore.remove("token");
          return $q.reject(response);
        } else {
          return $q.reject(response);
        }
      }
    };
  });

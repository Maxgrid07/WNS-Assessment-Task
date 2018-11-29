/* ============================================================
 * File: config.js
 * Configure routing
 * ============================================================ */

angular
  .module("app", [
    "ui.router",
    "ngCookies",
    "ngSanitize",
    "ngResource",
    "chart.js"
  ])
  .config([
    "$stateProvider",
    "$urlRouterProvider",
    "$locationProvider",
    "$httpProvider",
    function(
      $stateProvider,
      $urlRouterProvider,
      $locationProvider,
      $httpProvider
    ) {
      $locationProvider.html5Mode(true);
      $httpProvider.interceptors.push("authInterceptor");

      $urlRouterProvider.otherwise("/");
      $stateProvider
        .state("app", {
          url: "/",
          templateUrl: "app/login.html",
          controller: "AppCtrl"
        })
        .state("home", {
          url: "/home",
          templateUrl: "app/home.html",
          controller: "HomeCtrl"
        });
    }
  ])
  .run(function($rootScope, Auth, $state) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on("$stateChangeStart", function(event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          event.preventDefault();
          $state.go("/");
        } else if (next.authenticate && loggedIn) {
          $state.go("home");
        }
      });
    });

    $rootScope.$on("$stateChangeSuccess", function(event, next) {
      event.preventDefault();
    });
  });

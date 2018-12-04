(function() {
  "use strict";
  angular.module("app").controller("HomeCtrl", HomeCtrl);
  function HomeCtrl($rootScope, $scope, $state, Auth, Chart) {

    $scope.logout = function() {
      Auth.logout();
      $state.go("app");
    }

    function init() {

      Chart.getAvengers({ gender: true }).then(function(res) {
        $scope.labelsOne = [];
        $scope.dataOne = [];
        if(res.length) {
          res.forEach(function(row) {
            $scope.labelsOne.push(row._id)
            $scope.dataOne.push(row.count);
          });
        } else {
          alert('Unable to fetch data!');
        }
      });
    };

    init();

    // $scope.labels = [
    //   "January",
    //   "February",
    //   "March",
    //   "April",
    //   "May",
    //   "June",
    //   "July"
    // ];
    // $scope.series = ["Series A", "Series B"];
    // $scope.data = [[65, 59, 80, 81, 56, 55, 40], [28, 48, 40, 19, 86, 27, 90]];
    // $scope.onClick = function(points, evt) {
    //   console.log(points, evt);
    // };
    // $scope.datasetOverride = [{ yAxisID: "y-axis-1" }, { yAxisID: "y-axis-2" }];
    // $scope.options = {
    //   scales: {
    //     yAxes: [
    //       {
    //         id: "y-axis-1",
    //         type: "linear",
    //         display: true,
    //         position: "left"
    //       },
    //       {
    //         id: "y-axis-2",
    //         type: "linear",
    //         display: true,
    //         position: "right"
    //       }
    //     ]
    //   }
    // };
    // $scope.labelsOne = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
    // $scope.dataOne = [300, 500, 100];
  }
})();

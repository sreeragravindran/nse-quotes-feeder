(function(angular) {
    'use strict';
    angular.module('ngIndex', ['ngAnimate']).controller('homeController', function($scope, $http) {
        var stocks = null;

        $http.get("stocks/ichimoku")
        .then(function success(response){
            stocks = response.data;
            $scope.items = stocks;
        }, function error(errorResponse){

        });
        // $scope.items = 

    });
  })(window.angular);
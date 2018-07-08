(function(angular) {
    'use strict';
    angular.module('ngIndex', ['ngAnimate']).controller('homeController', function($scope, $http) {
        var stocks = null;

        $http.get("stocks/ichimoku")
        .then(function success(response){
            stocks = response.data;
            $scope.items = stocks;

            setTimeout(function(){ 
                $scope.items[0] = { "symbol" : "ACC", "baseLine" : "ABOVE RED", "conversionLine" : "ABOVE BLUE", "cloud" : "ABOVE CLOUD" };       
            }, 3000);

        }, function error(errorResponse){
            
        });
        // $scope.items = 

        

    });
  })(window.angular);
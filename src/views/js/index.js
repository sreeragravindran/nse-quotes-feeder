
(function(angular) {
    'use strict';
    angular.module('ngIndex', ['ngAnimate']).controller('homeController', function($scope, $http) {
        //var stocks = null;

        $http.get("stocks/ichimoku")
        .then(function success(response){

            var indexMap = new Map();
            $scope.stocks = response.data;
            $scope.stocks.forEach((stock, index) => {
                indexMap.set(stock.symbol, index); 
            });
            
            var ws = new WebSocket('ws://localhost:40510');
            ws.onopen = function () {
                console.log('websocket is connected ...')
                ws.send('connected')
            }
            ws.onmessage = function (message) {
              console.log(JSON.parse(message.data));
              var stock = JSON.parse(message.data);
              var index = indexMap.get(stock.symbol);
              console.log(index);
              $scope.stocks[index] = stock;
              $scope.$apply();
            }

        }, function error(errorResponse){
            
        });
    });
  })(window.angular);



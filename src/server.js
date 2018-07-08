const express = require('express')
const WebSocketServer = require('ws').Server; 
const stockUpdaterService = require('./domain/service/stockUpdater');
const viewModels = require('./views/models');

var server = express();

server.use(express.static(__dirname + '/views'));

//console.log(__dirname);

require('./routes')(server);

var wss = new WebSocketServer({port: 40510}); 

wss.on('connection', function (ws) {
    ws.on('message', function (message) {    
        //console.log('received: %s', message)
    })
})

server.listen(3000, function(){
    console.log("stock quotes service listening on port 3000 !")

    stockUpdaterService.updateStockQuotes(function(error, latestCandle){
      if(latestCandle){
          console.log("updated notification received for ", latestCandle.symbol, latestCandle);
          var viewModel = new viewModels.IchimokuCloudViewModel().mapFrom(latestCandle);  
          wss.clients.forEach((ws) => {
            ws.send(viewModel);
        })   
      }  
    })
})

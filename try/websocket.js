// https://medium.com/factory-mind/websocket-node-js-express-step-by-step-using-typescript-725114ad5fe4
// https://hackernoon.com/nodejs-web-socket-example-tutorial-send-message-connect-express-set-up-easy-step-30347a2c5535 

var express = require('express')
var WebSocketServer = require('ws').Server; 
var alpha = require('../src/domain/alpha-vantage');

var app = express();

app.get('/', function (req, res) {
   res.sendFile('ws.html', {root: __dirname});
})

var wss = new WebSocketServer({port: 40510}); 

wss.on('connection', function (ws) {

    ws.on('message', function (message) {    
        console.log('received: %s', message)
    })
    // setInterval(
    //     () => ws.send(`${new Date()}`),
    //     3000
    // )
})

app.listen(3000, function () {
   console.log('Example app listening on port 3000!')

   alpha.getIntraday1mSeriesForAllStocks(function(error, data){  
        if(data){
            console.log(data.symbol, data.priceVolumeSeries[0].close);
            wss.clients.forEach((ws) => {
                ws.send(`${data.symbol}, ${data.priceVolumeSeries[0].close}`);
            })     
        }
   })
})


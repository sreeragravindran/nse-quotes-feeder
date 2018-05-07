var restify = require('restify');

var server = restify.createServer({
    name: 'nse-price-service'
})

server.listen('8080', '127.0.0.1', function(){
    console.log('%s listening at %s', server.name, server.url);
})
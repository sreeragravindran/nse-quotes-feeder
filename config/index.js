const env = process.env.NODE_ENV; // 'dev' or 'test'

const dev = {
 app: {
   port: 3000,
   
 },
 websocket :{
     port : 401510
 },
 alphaVantage : {
    apiKey : 'D11MRXG1OJVDIBYU',
    requestInterval : 3000,
    stockSource : 'data/equities.top-picks.txt',
    validateMarketHours : true
 },
 stockExchange: {
    stockSource : 'data/equities.top-picks.txt'
 },
 db: {
    storage: '/opt/sqlite/stock_quotes.db'
 }
};

const test = {
 app: {
   port: 3000
 },
 db: {
   host: 'localhost',
   port: 27017,
   name: 'test'
 }
};

const config = {
 dev,
 test
};

module.exports = config[env];
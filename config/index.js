const env = process.env.NODE_ENV; // 'dev' or 'test'

const dev = {
 app: {
   port: 3000
 },
 websocket :{
     port : 401510
 },
 alphaVantage : {
    apiKey : 'D11MRXG1OJVDIBYU',
    requestInterval : 3000,
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
  websocket :{
      port : 401510
  },
  alphaVantage : {
     apiKey : 'D11MRXG1OJVDIBYU',
     requestInterval : 3000,
     validateMarketHours : true
  },
  stockExchange: {
     stockSource : 'data/equities.top-picks.txt'
  },
  db: {
     storage: '/usr/src/app/stock_quotes.db'
  }
 };

 const prod = {
  app: {
    port: 3000
  },
  websocket :{
      port : 401510
  },
  alphaVantage : {
     apiKey : process.env.APIKEY,
     requestInterval : 3000,
     validateMarketHours : true
  },
  stockExchange: {
     stockSource : 'data/equities.top-picks.txt'
  },
  db: {
     storage: '/usr/src/app/stock_quotes.db'
  }
 };

const config = {
 dev,
 test,
 prod
};

module.exports = config[env];
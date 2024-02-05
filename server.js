// This RPC server will announce itself as `rpc_test`
// in our Grape Bittorrent network
// When it receives requests, it will answer with 'world'

'use strict'

const { PeerRPCServer }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')
const config = require('./config');

const { OrderBook } = require('./src/orderbook');
const { Logger } = require('./src/logger');

// this is our orderbook instance from each client
// its in charge to distribute requests and announce new ones
// client.js just submits requests

const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new PeerRPCServer(link, {
  timeout: 300000
})
peer.init()

const port = 1024 + Math.floor(Math.random() * 1000)
const service = peer.transport('server')
service.listen(port)

console.log('started service');

const logger = new Logger();
const instanceOrderBook = new OrderBook();

setInterval(() => {
  // Announce service and synchronize order books with connected clients
  link.announce(config._workerName, service.port, {});
  syncOrderBooks();
}, 1000);

async function handleRequest({ key, payload, handler }) {
  logger.info({key: 'handleRequest', payload});
  
  // debug things
  logger.debug(payload);


  handler.reply(null, { msg: 'world' });
};

// Register service to listen to requests
service.on('request', async (rid, key, payload, handler) => {
  await handleRequest({ key, payload, handler });
})

function syncOrderBooks() {
  // Retrieve the global order book from the server
  const globalOrderBook = instanceOrderBook.getOrderBook();

  // Iterate through connected clients and synchronize their local order books
  link.announce('rpc_test', service.port, { orderBook: globalOrderBook });
}
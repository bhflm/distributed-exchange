// This RPC server will announce itself as `rpc_test`
// in our Grape Bittorrent network
// When it receives requests, it will answer with 'world'

'use strict'

const { PeerRPCServer }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')
const config = require('./config');

const { OrderBook } = require('./src/orderbook');
const { Logger } = require('./src/logger');

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

const logger = new Logger('Server');

const instanceOrderBook = new OrderBook();

setInterval(async () => {
  logger.info({ data: 'Announcing to network' });
  link.announce(config._workerName, service.port, {});
  await syncOrderBooks();
}, 5000);

async function handleRequest(requestData) {
  logger.info({ data: 'handleRequest' });

  const { key, payload, handler } = requestData;

  try {
    if (payload.type == 'UPDATE' && payload.localOrderbook) {
      // Update orderbook instance;
      const { localOrderbook } = payload;
      instanceOrderBook.syncExternalOrderBook({ orders: localOrderbook.orders, fullfilledOrders: localOrderbook.fullfilledOrders });
    }
  
    const syncdOrderbookInfo = await instanceOrderBook.getOrderBook();

    handler.reply(null, { data: syncdOrderbookInfo, status: 'success' });
  } catch(err) {
    logger.error(err);
    logger.debug(err);
    handler.reply(null, { status: 'error' });
  }
};

// Register service to listen to requests
service.on('request', async (rid, key, payload, handler) => {
  await handleRequest({ key, payload, handler });
})

async function syncOrderBooks() {
  // Retrieve the global order book from the server
  const globalOrderBook = await instanceOrderBook.getOrderBook();
  link.announce(config._workerName, service.port, { orderBook: globalOrderBook });
}
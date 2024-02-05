// This client will as the DHT for a service called `rpc_test`
// and then establishes a P2P connection it.
// It will then send { msg: 'hello' } to the RPC server

'use strict'

const { PeerRPCClient }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')
const config = require('./config');
const { Logger } = require('./src/logger');
const { Lock } = require('./src/common/lock');
const { OrderBook } = require('./src/orderbook');

const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new PeerRPCClient(link, {})
peer.init()

const logger = new Logger('Client');
const lock = new Lock();

const asset = 'USDT';
const localOrderBook = new OrderBook(asset);

function promisifyPeerRequest(peerId, data, config) {
  logger.info({ data: 'Broadcasting to network'});
  return new Promise((resolve, reject) => {
    peer.request(peerId, data, config, (err, data) => {
      if (err) {
        logger.error(`Error broadcasting ${err}`);
        reject(err);
      }
      logger.info({data: 'Broadcasted to network'});
      resolve(data);
    });

  });
};

async function makeClientRequest(peerId, data, config) {
  logger.info({ data: 'makeClientRequest' });

  if (!config.timeOut) {
    config.timeOut = 10000;
  };

  if (!peerId) {
    const errorMessage = 'Need to specify peerId';
    logger.error(errorMessage);
    return null;
  }

  if (!data) {
    const errorMessage = 'Need to send data';
    console.error(errorMessage);
    return null;
  };

  try {
    logger.info({ data });
    const { type, amount, price } = data;
    if (!type || !amount || !price) {
      throw new Error('Missing parameters');
    }

    await localOrderBook.submitNewOrder({
      type,
      amount,
      price
    });
    logger.info({ data: 'Submitted new order' });

    // Once local client instance is modified, broadcast the client orderbook
    await promisifyPeerRequest(peerId, { type: 'UPDATE', localOrderBook }, config);

  } 
  catch(err) {
    logger.error(err);
  } finally {
    await lock.release();
  };
};


const peerConfig = {
  timeout: 10000,
};

async function main() {
  const orderA = {
    type: 'SELL',
    amount: 1,
    price: 1000
  };

  const orderB = {
    type: 'BUY',
    amount: 1,
    price: 1000
  };

  try {
    
    await makeClientRequest(config._workerName, orderA, peerConfig);
    await makeClientRequest(config._workerName, orderB, peerConfig);

  } catch (error) {
    console.error('Error in main:', error);
  }
}

main();
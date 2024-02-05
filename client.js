// This client will as the DHT for a service called `rpc_test`
// and then establishes a P2P connection it.
// It will then send { msg: 'hello' } to the RPC server

'use strict'

const { PeerRPCClient }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')
const config = require('./config');
const { Logger } = require('./src/logger');
const { Lock } = require('./src/common');
const { OrderBook } = require('./src/orderbook');

const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new PeerRPCClient(link, {})
peer.init()

const logger = new Logger();
const lock = new Lock();

// Sample asset
const asset = 'USDT';
const localOrderBook = new OrderBook('usdt');


function promisifyPeerRequest(peerId, data, config) {
  return new Promise((resolve, reject) => {
    peer.request(peerId, data, config, (err, data) => {
      if (err) {
        console.error(err)
        reject(err);
      }
      console.log(data) 
      resolve(data);
    });

  });
};

async function makeClientRequest(peerId, data, config) {
  if (!config.timeOut) {
    config.timeOut = 10000;
  };

  if (!peerId) {
    const errorMessage = 'Need to specify peerId';
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  if (!data) {
    const errorMessage = 'Need to send data';
    console.error(errorMessage);
    throw new Error(errorMessage);
  };

  try {
    logger.info({ key: 'clientRequest', data });
    await lock.acquire();
    await promisifyPeerRequest(peerId, data, config);
  } 
  catch(err) {
    logger.error(err);
  } finally {
    await lock.release();
  };
};


// @@ TODO
// manually testing this should be later refactored onto a script or cli alike exposure
const order = {
  type: 'BUY',
  amount: 1,
  price: 1000
};



const peerConfig = {
  timeout: 10000,
};


function main() {
  return makeClientRequest(config._workerName, addOrderRequest, peerConfig);
}

main();
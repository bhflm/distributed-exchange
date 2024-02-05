// This RPC server will announce itself as `rpc_test`
// in our Grape Bittorrent network
// When it receives requests, it will answer with 'world'

'use strict'

const { PeerRPCServer }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')
const config = require('./config');

// this is our orderbook instance from each client
// its in charge to distribute requests and announce new ones
// client.js just submits requests


console.log('WORKER NAME: ', workerName);

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

setInterval(function () {
  link.announce(config._workerName, service.port, {})
}, 1000)


function handleRequest({ rid, key, payload, handler }) {
  // @@ todo: replace with a proper logger
  console.log(`${Date.now().toLocaleString()} - ${rid} ${key} ${payload}`);

  handler.reply(null, { msg: 'world' });
};

service.on('request', (rid, key, payload, handler) => {
  // This is a new request 
  console.log('NEW REQUEST');
  handleRequest({ rid, key, payload, handler });
})
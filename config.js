const WORKER_NAME = !!process.env.WORKER_ID ? process.env.WORKER_ID : 'orderbook'

module.exports = { 
  _workerName: WORKER_NAME
};

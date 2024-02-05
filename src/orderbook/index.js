const { createEnum } = require("../common");

/**
 * Makes an enum of type
 * enum {
 *  SELL,
 *  BUY
 * }
 */
const OrderType = createEnum(['SELL', 'BUY']);

/**
 * Order is meant for each instance of a new order
 */
class Order { 
  constructor(type, amount, price) {
    if (OrderType[type] === undefined) {
      throw new Error('Need a valid Order Type');
    };

    if (amount <= 0 || price <= 0) {
      throw new Error('Amount & Price needs to be positive');
    }

    this.id = Math.random(); // uid ?


    this.type = type; // this should be orderType
    this.price = price;
    this.amount = amount;
  };
};

/**
 * Orderbook keeps in charge of order functionalities (buy, sell, get?), tracking all orders and ordermatching
 */
class OrderBook {
  
  constructor (asset){ 
    this.asset = asset;
    this.buyOrders = new Array();
    this.sellOrders = new Array();
  }

  getAsset() {
    return this.asset;
  }

  _getBuyOrders() {
    return this.buyOrders;
  };

  _getSellOrders() {
    return this.sellOrders;
  };

  addOrder(orderData) {
    console.log('adding order: ', orderData);
    const { type, amount, price } = orderData;
    const newOrder = new Order(type, amount, price);

    switch(newOrder.type) {
      case OrderType.SELL: {
        this.sellOrders.push(newOrder)
        break;
      };
      case OrderType.BUY: {
        this.buyOrders.push(newOrder);
        break;
      }
    };

    console.log('Added Order');
    // do stuff;
    return;
  }

  matchOrder(order){
    // @@TODO;
    return null;
  };

  getOrder(order) {
    return null;
  }
  
};

module.exports = {
  Order,
  OrderBook,
}
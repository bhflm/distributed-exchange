import { createEnum } from "../common";

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
  constructor(type, asset, amount) {
    if (OrderType[type] === undefined) {
      throw new Error('Need a valid Order Type');
    };

    if (amount <= 0) {
      throw new Error('Amount needs to be positive');
    }

    this.id = Math.random(); // uid ?


    this.type = type; // this should be orderType
    this.asset = asset;
    this.amount = amount;
  };
};

/**
 * Orderbook keeps in charge of order functionalities (buy, sell, get?), tracking all orders and ordermatching
 */
class OrderBook {
  
  constructor (){ 
    this.orders = new Array();
  }

  addOrder(order) {
    console.log('adding order: ', order);
    this.orders.push(order);
    // do stuff;
    return;
  }

  matchOrder(order){
    // @@TODO;
    return null;
  };

  getOrder(order) {
    // @@ TODO;

    return null;
  }
  
};

module.exports = {
  Order,
  OrderBook,
}
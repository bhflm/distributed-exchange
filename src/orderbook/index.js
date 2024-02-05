const errorMessages = require('./errors');
const { createEnum } = require("../common");

/**
 * Makes an enum of type
 * enum {
 *  SELL,
 *  BUY
 * }
 */
const OrderType = createEnum(['SELL', 'BUY']);


// Returns against order type to match for
const getOrderTypeToMatch = (orderType) => {
  switch(orderType) {
    case OrderType.SELL:
      return OrderType.BUY;
    case OrderType.BUY:
      return OrderType.SELL;  
  };
};
/**
 * Order is meant for each instance of a new order
 */
class Order { 
  constructor(type, amount, price) {
    if (OrderType[type] === undefined) {
      throw new Error(errorMessages.unknownOrderErrorMesage);
    };

    if (amount <= 0 || price <= 0) {
      throw new Error(errorMessages.negativeAmountPriceErrorMessage);
    }

    this.id = Math.random().toString(36).substring(7);


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
    this.orders = {
      [OrderType.BUY]: new Array(),
      [OrderType.SELL]: new Array(),
    }
  }

  getAsset() {
    return this.asset;
  }

  _getBuyOrders() {
    return this.orders[OrderType.BUY];
  };

  _getSellOrders() {
    return this.orders[OrderType.SELL];
  };

  addOrder(orderData) {
    const { type, amount, price } = orderData;
    const newOrder = new Order(type, amount, price);

    switch(newOrder.type) {
      case OrderType.SELL: {
        const sellOrders = this.orders[OrderType.SELL];
        sellOrders.push(newOrder);
        // @@ TODO, Sync orderbook with other peers
        break;
      };
      case OrderType.BUY: {
        const buyOrders = this.orders[OrderType.BUY];
        buyOrders.push(newOrder);
        // @@ TODO, Sync orderbook with other peers
        break;
      }
    };
    // do stuff;


    // @@ TODO, Sync orderbook with other peers
    return;
  }

  matchOrders(order){

    console.log('MATCH ORDERS: ', order);

    const oppositeOrderType = getOrderTypeToMatch(order.type);

    console.log('ORDER TO MATCH', oppositeOrderType);
    const toMatchOrders = this.orders[oppositeOrderType];

    console.log('OPPOSITE ORDERS', toMatchOrders);


    // Lock ??? 



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
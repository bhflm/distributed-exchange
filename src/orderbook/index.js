const errorMessages = require('./errors');
const { createEnum } = require("../common");
const { Lock } = require('../common/lock');

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
    this.fullfilledOrders = new Array();
    this.lock = new Lock(); // @@ TODO, Do we need to keep record of fulfilled orders ?;
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

  _getFullfilledOrders() {
    return this.fullfilledOrders;
  };

  _addOrder(newOrder) {
    const { type, amount, price } = newOrder;

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
    return;
  }

  _matchOrders(order){
    const { type } = order;

    let currentOrder = { ...order };

    const oppositeOrderType = getOrderTypeToMatch(type);
    const toMatchOrders = this.orders[oppositeOrderType];

    // Takes the current order and tries to match it with equal order prices
    for (let i = 0; i < toMatchOrders.length; i ++) {
      const oppositeOrder = toMatchOrders[i];
      // WE found a matching order price (equal or lower), so we take the min quantity offered
      // ie: we make a trade 

      // This is for buying; // whenever buying I'm trying to buy at the same or lower price
      // For selling ,I'm trying to sell at the same, or higher price, for maximize profit
      if (oppositeOrder.price <= currentOrder.price) {
        console.log('FOUND MATCH: ', currentOrder, oppositeOrder);

        const tradeQuantity = Math.min(currentOrder.amount, oppositeOrder.amount);
        // const tradePrice = oppositeOrder.price;

        currentOrder.amount -= tradeQuantity;
        oppositeOrder.amount -= tradeQuantity;

        if (oppositeOrder.amount === 0) {
            const [ _matchedOrder ] = toMatchOrders.splice(i, 1);

            console.log(_matchedOrder);
            this.fullfilledOrders.push(_matchedOrder);
            i -= 1;
        }

        // Order is fulfilled, we remove it from array too
        if (currentOrder.amount === 0) {
            const [ _fullfilledOrder ] = this.orders[type].splice(i, 1);
            this.fullfilledOrders.push(_fullfilledOrder);
            i -= 1;
            break;
        } else {
          // Update order array with modified matched order;
          this.orders[type][i] = currentOrder;
        };
      }

    }

    // public

  };

  async submitNewOrder({ type, amount, price }){
    // Lock Ob;
    try {
      if (this.lock.isLocked) {
        throw new Error(errors.resourceUnavailable);
      }

      await this.lock.acquire();

      const newOrder = new Order(type, amount, price);
      
      this._addOrder(newOrder);
      this._matchOrders(newOrder);
  
    } catch(err) {
      console.error('Error processing order:', err);
    } finally {
      await this.lock.release();
    }

  };


  async syncOrderBook(globalOrderbook) {
    await this.lock.acquire();

    const updatedOrders = globalOrderbook.orders;
    this.orders = updatedOrders;

    const updatedFulfilled = globalOrderbook.fullfilledOrders;
    this.fullfilledOrders = updatedFulfilled;

    await this.lock.release();
  };

};

module.exports = {
  Order,
  OrderBook,
}
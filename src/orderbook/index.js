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
    this.fullfilledOrders = new Array(); // @@ TODO, Do we need to keep record of fulfilled orders ?;
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

  _addOrder(orderData) {
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
    // @@ TODO, Sync orderbook with other peers
    return;
  }

  _matchOrders(order){
    console.log('MATCH ORDERS: ', order);
    const { type } = order;

    let orderData = { ...order };
    const oppositeOrderType = getOrderTypeToMatch(type);
    const toMatchOrders = this.orders[oppositeOrderType];

    console.log('OPPOSITE ORDERS', toMatchOrders);

    let matchingOrders = new Array();

    // Takes the current order and tries to match it with equal order prices
    for (let i = 0; i < toMatchOrders.length; i ++) {
      const oppositeOrder = toMatchOrders[i];

      // WE found a matching order price, so we take the min quantity offered
      // ie: we make a trade 
      if (orderData.price === oppositeOrder.price) {

        console.log('EQUAL ORDERS', orderData, oppositeOrder);

        const tradeQuantity = Math.min(orderData.amount, oppositeOrder.amount);
        const tradePrice = oppositeOrder.price;

        orderData.amount -= tradeQuantity;
        oppositeOrder.amount -= tradeQuantity;

        if (oppositeOrder.amount === 0) {
            const [ _matchedOrder ] = toMatchOrders.splice(i, 1);
            this.fullfilledOrders.push(_matchedOrder);
            i -= 1;
        }

        matchingOrders.push({
            type,
            pkId: orderData.id,
            skId: oppositeOrder.id,
            quantity: tradeQuantity,
            price: tradePrice,
        });

        // Order is fulfilled, we remove it from array too
        if (orderData.amount === 0) {
            // Remove fulfilled order from array;
            const [ _fullfilledOrder ] = this.orders[type].splice(i, 1);
            this.fullfilledOrders.push(_fullfilledOrder);
            i -= 1;
            break;
        }
      }
    }
  };

  getOrder(order) {
    return null;
  }
  
};

module.exports = {
  Order,
  OrderBook,
}
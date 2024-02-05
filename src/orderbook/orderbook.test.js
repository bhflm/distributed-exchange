const OrderErrors = require('./errors');
const { OrderBook} = require('.');

describe('OrderBook', () => {
  const ob = new OrderBook('usdt'); 
   
  it('Should not add an unknown order', () => {
    const mockOrder = {
      type: 'UNKNOWN',
      amount: 1,
      price: 1,
    };

    try {
      ob.addOrder(mockOrder)
    } catch(err) {
      expect(err.message).toBe(OrderErrors.unknownOrderErrorMesage);
    }
  });

  it('Should not add negative amount order', () => {
    const mockOrder = {
      type: 'BUY',
      amount: -1,
      price: 1,
    };

    try {
      ob.addOrder(mockOrder)
    } catch(err) {
      expect(err.message).toBe(OrderErrors.negativeAmountPriceErrorMessage);
    }
  });
  
  it('Should not add negative price order', () => {
    const negativeAmountPriceErrorMessage = 'Amount & Price needs to be positive';

    const mockOrder = {
      type: 'SELL',
      amount: 1,
      price: -1,
    };

    try {
      ob.addOrder(mockOrder)
    } catch(err) {
      expect(err.message).toBe(OrderErrors.negativeAmountPriceErrorMessage);
    }
  });

  it('Should add a new order to buy orders', () => {
      const mockOrder = {
        type: 'BUY',
        amount: 1,
        price: 1,
      };
      ob.addOrder(mockOrder)

      expect(ob.asset).toBe('usdt');
      expect(ob._getBuyOrders().length).toBe(1);
    });
  
});
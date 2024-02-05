const { Order, OrderBook} = require('.');

describe('OrderBook', () => {
  const ob = new OrderBook('usdt'); 
   
  it('Should not add an unknown order', () => {
    const unknownOrderErrorMesage = 'Need a valid Order Type';

    const mockOrder = {
      type: 'UNKNOWN',
      amount: 1,
      price: 1,
    };

    try {
      ob.addOrder(mockOrder)
    } catch(err) {
      expect(err.message).toBe(unknownOrderErrorMesage);
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
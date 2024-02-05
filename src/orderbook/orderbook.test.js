const OrderErrors = require('./errors');
const { OrderBook} = require('.');

describe('OrderBook', () => {
  
  let ob = new OrderBook('usdt'); 
  let mockOrder;   

  beforeEach(() => {
    // Reset ob for each isolated test;
    ob = new OrderBook('usdt');
  });


  it('Should not add an unknown order', () => {
    mockOrder = {
      type: 'UNKNOWN',
      amount: 1,
      price: 1,
    };

    try {
      ob._addOrder(mockOrder)
    } catch(err) {
      expect(err.message).toBe(OrderErrors.unknownOrderErrorMesage);
    }
  });

  it('Should not add negative amount order', () => {
    mockOrder = {
      type: 'BUY',
      amount: -1,
      price: 1,
    };

    try {
      ob._addOrder(mockOrder)
    } catch(err) {
      expect(err.message).toBe(OrderErrors.negativeAmountPriceErrorMessage);
    }
  });
  
  it('Should not add negative price order', () => {
    mockOrder = {
      type: 'SELL',
      amount: 1,
      price: -1,
    };

    try {
      ob._addOrder(mockOrder)
    } catch(err) {
      expect(err.message).toBe(OrderErrors.negativeAmountPriceErrorMessage);
    }
  });

  it('Should add a new order to buy orders', () => {
    mockOrder = {
      type: 'BUY',
      amount: 1,
      price: 1,
    };
    ob._addOrder(mockOrder)

    expect(ob.asset).toBe('usdt');
    expect(ob._getBuyOrders().length).toBe(1);
  });

  it('Should add sell order', () => {
    mockOrder = {
      type: 'SELL',
      amount: 2,
      price: 2,
    };
    ob._addOrder(mockOrder)

    expect(ob.asset).toBe('usdt');
    expect(ob._getSellOrders().length).toBe(1);
  });


  it('Should not match orders with different prices', () => {

    let sellOrder = {
      type: 'SELL',
      amount: 1,
      price: 99999,
    };

    ob._addOrder(sellOrder);
    expect(ob._getSellOrders().length).toBe(1);
    
    mockOrder = {
      id: 'mockId',
      type: 'BUY',
      amount: 1,
      price: 1,
    };

    ob._addOrder(mockOrder);
    ob._matchOrders(mockOrder);
    expect(ob._getBuyOrders().length).toBe(1);
    expect(ob._getSellOrders().length).toBe(1);
    expect(ob._getFullfilledOrders().length).toBe(0);
    
  });

  xit('Should match both orders and remove from order arrays', () => {

    let sellOrder = {
      type: 'SELL',
      amount: 2,
      price: 2,
    };

    ob._addOrder(sellOrder);
    expect(ob._getSellOrders().length).toBe(1);
    
    mockOrder = {
      id: 'mockId',
      type: 'BUY',
      amount: 2,
      price: 2,
    };

    ob._addOrder(mockOrder);
    ob._matchOrders(mockOrder);

    console.log('ob state post: ', ob);

    expect(ob._getBuyOrders().length).toBe(0);
    expect(ob._getSellOrders().length).toBe(0);
    expect(ob._getFullfilledOrders().length).toBe(2);
    
  });


  // it('Should match one order at lower price', () => {

  //   let sellOrderA = {
  //     type: 'SELL',
  //     amount: 1,
  //     price: 1,
  //   };

  //   let sellOrderB = {
  //     type: 'SELL',
  //     amount: 2,
  //     price: 1,
  //   };


  //   ob._addOrder(sellOrderA);
  //   ob._addOrder(sellOrderB);
    
  //   expect(ob._getSellOrders().length).toBe(2);
    
  //   mockOrder = {
  //     id: 'mockId',
  //     type: 'BUY',
  //     amount: 2,
  //     price: 2,
  //   };

  //   ob._addOrder(mockOrder);
  //   ob._matchOrders(mockOrder);

  //   console.log('ob state post: ', ob);

  //   expect(ob._getBuyOrders().length).toBe(0);
  //   expect(ob._getSellOrders().length).toBe(0);
  //   expect(ob._getFullfilledOrders().length).toBe(2);
    
  // });

  });
const {
  STRIPE_SECRET_KEY,
} = process.env;

const BaseModel = require('./BaseModel');
const stripe = require('stripe')(STRIPE_SECRET_KEY);
const db = require('../utils/db.js');

/**
 * An instance of a order
 * @class
 */
class Order extends BaseModel {
  constructor() {
    super();

    this.name;
    this.detail;
    this.price;
    this.available;
  }

  // static create(amount, customer, source, description) {
  //   return stripe.charges.create({
  //     amount,
  //     customer,
  //     currency: 'gbp',
  //     source,
  //     description,
  //   });
  // }

  static createIntent(totalPricePence, description, data) {
    return stripe.paymentIntents.create({
      amount: totalPricePence,
      currency: 'gbp',
      payment_method_types: ['card'],
      metadata: {
        description,
        data,
      },
    });
  }

  static getIntent(intent) {
    return stripe.paymentIntents.retrieve(intent);
  }

  static async create(orderData, products) {
    const order = await db(this.table).insert(orderData).returning('id');
    for (const product of products) {
      const newProduct = product;
      newProduct.order_id = order[0];
      await db('order_items').insert(newProduct);
    }

    return true;
  }
}

Order.table = 'order';

module.exports = Order;

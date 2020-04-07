const {
  STRIPE_SECRET_KEY,
} = process.env;

const BaseModel = require('./BaseModel');
const stripe = require('stripe')(STRIPE_SECRET_KEY);

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

  static createIntent(totalPricePence) {
    return stripe.paymentIntents.create({
      amount: totalPricePence,
      currency: 'gbp',
      payment_method_types: ['card'],
    });
  }
}

Order.table = 'order';

module.exports = Order;

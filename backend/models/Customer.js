const {
  STRIPE_SECRET_KEY,
} = process.env;

const BaseModel = require('./BaseModel');
const stripe = require('stripe')(STRIPE_SECRET_KEY);

/**
 * An instance of a customer
 * @class
 */
class Customer extends BaseModel {
  constructor() {
    super();

    this.name;
    this.detail;
    this.price;
    this.available;
  }

  // Override default find with Stripe one
  static async find(options = {}) {
    const {
      search,
    } = options;

    const rawCustomers = await stripe.customers.list();
    const customers =  rawCustomers.data.map(({id, address, default_source, email, phone, name}) => ({id, address, default_source, email, phone, name})); // eslint-disable-line
    if (search) {
      return customers.filter((customer) => customer.name.toLowerCase().indexOf(search.toLowerCase()) !== -1);
    } else {
      return customers;
    }
  }
}

Customer.table = 'customer';

module.exports = Customer;

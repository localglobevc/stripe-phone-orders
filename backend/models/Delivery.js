const BaseModel = require('./BaseModel');

/**
 * An instance of a product
 * @class
 */
class Delivery extends BaseModel {
  constructor() {
    super();

    this.name;
    this.title;
    this.price;
  }
}

Delivery.table = 'delivery';

module.exports = Delivery;

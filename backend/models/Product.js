const BaseModel = require('./BaseModel');

/**
 * An instance of a product
 * @class
 */
class Product extends BaseModel {
  constructor() {
    super();

    this.name;
    this.detail;
    this.price;
    this.available;
  }
}

Product.table = 'product';

module.exports = Product;

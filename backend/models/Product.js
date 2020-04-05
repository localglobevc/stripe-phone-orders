const BaseModel = require('./BaseModel');
const md5 = require('../utils/md5');
const jwt = require('jsonwebtoken');

const {
  SECRET,
} = process.env;

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

User.table = 'product';

module.exports = Product;

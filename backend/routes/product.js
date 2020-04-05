const BaseModel = require('./BaseModel');

/**
 * An instance of a user
 * @class
 */
class User extends BaseModel {
  constructor() {
    super();

    this.name;
    this.detail;
    this.price;
    this.available;
  }
}

module.exports = User;

const BaseModel = require('./BaseModel');
const md5 = require('../utils/md5');
const db = require('../utils/db.js');
const jwt = require('jsonwebtoken');

const {
  SECRET,
} = process.env;

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

  static async login(email, password) {
    try {
      const user = await this.findOne({
        email: email.toLowerCase(), // Force lowercase email
        password: md5(password),
      });

      return jwt.sign({email: user.email, admin: user.admin}, SECRET, {expiresIn: '48h'});
    } catch (e) {
      return e.message;
    }
  }
}

module.exports = User;

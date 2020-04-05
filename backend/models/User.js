const BaseModel = require('./BaseModel');
const md5 = require('../utils/md5');
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
    this.email;
    this.password;
    this.admin;
  }

  static async login(email, password) {
    const user = await this.findOne({
      email: email.toLowerCase(), // Force lowercase email
      password: md5(password),
    });

    return jwt.sign({name: user.name, email: user.email, password: user.password, admin: user.admin}, SECRET, {expiresIn: '48h'});
  }

  static async checkUser(email, password) {
    try {
      const user = await this.findOne({
        email: email, // Force lowercase email
        password: password,
      });

      if (user) {
        return true;
      }
    } catch (e) {
      return false;
    }
  }
}

User.table = 'user';

module.exports = User;

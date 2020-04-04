const BaseModel = require('./BaseModel');
const md5 = require('../utils/md5');
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

  static async findOne(options = {}) {
    // Returns a single user
  }

  async update(options = {}) {

  }

  static async login(email, password) {
    try {
      if (!email) {
        throw new Error('Email address invalid');
      }

      if (!password) {
        throw new Error('Password invalid');
      }

      const user = this.findOne({
        email,
        password: md5(password),
      });

      return true;
    } catch (e) {
      return e.message;
    }
  }
}

module.exports = User;

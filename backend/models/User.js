const BaseModel = require('./BaseModel');
const md5 = require('../utils/md5');
const db = require('../utils/db.js');

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
    const user = await db('users')
      .where(options);

    return user;
  }

  async update(options = {}) {

  }

  static async login(email, password) {
    try {
      const user = this.findOne({
        email,
        password: md5(password),
      });

      return user;
    } catch (e) {
      return e.message;
    }
  }
}

module.exports = User;

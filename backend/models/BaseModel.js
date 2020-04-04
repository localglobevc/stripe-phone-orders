const db = require('../utils/db.js');

/**
 * Base model, all other models inherit from
 * @class
 */
class BaseModel {
  constructor() {
    this.table;
  }

  static async findOne(options = {}) {
    // Returns a single user
    console.log(this);
    const items = await db(this.table)
      .where(options);

    if (items && items[0]) {
      return items[0];
    } else {
      throw new Error('Not found');
    }
  }
}

module.exports = BaseModel;

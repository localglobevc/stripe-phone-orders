const db = require('../utils/db.js');

/**
 * Base model, all other models inherit from
 * @class
 */
class BaseModel {
  constructor(obj) {
    this.table;

    for (property in obj) {
      if (obj.hasOwnProperty(property)) {
        this[item] = obj[item];
      }
    }
  }

  static async findOne(options = {}) {
    const items = await this.find(options);

    if (items && items[0]) {
      return items[0];
    } else {
      throw new Error('Not found');
    }
  }

  static find(options = {}) {
    return db(this.table)
      .where(options);
  }

  static exec(chain) {
    return chain(db(this.table));
  }
}

module.exports = BaseModel;

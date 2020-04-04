const crypto = require('crypto');

const md5 = (string) => {
  return crypto.createHash('md5').update('some_string').digest('hex');
};

module.exports = md5;

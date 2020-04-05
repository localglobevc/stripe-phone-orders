const Product = require('../models/Product');

const registerProductRoutes = (router) => {
  router
    .get('/product', async (ctx, next) => {
      const products = await Product.find().orderBy('available', 'DESC');
      return ctx.body = products;
    });
};

module.exports = registerProductRoutes;

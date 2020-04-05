const Customer = require('../models/Customer');

const registerCustomerRoutes = (router) => {
  router
    .get('/customer', async (ctx, next) => {
      const {
        search,
      } = ctx.request.query;

      const customers = await Customer.find({search});
      return ctx.body = customers;
    })
    .post('/customer', async (ctx, next) => {
      const {
        name,
        address,
        phone,
        email,
      } = ctx.request.body;

      const customer = await Customer.create({
        name,
        address,
        phone,
        email,
      });

      return ctx.body = customer;
    });
};

module.exports = registerCustomerRoutes;

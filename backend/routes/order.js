const Product = require('../models/Product');
const Delivery = require('../models/Delivery');
const Customer = require('../models/Customer');
const Order = require('../models/Order');

const registerProductRoutes = (router) => {
  router
    .post('/order/authorise', async (ctx, next) => {
      const {
        customerStripeId,
        productIds = [],
        deliveryId,
      } = ctx.request.body;

      if (
        !customerStripeId ||
        productIds.length === 0 ||
        !deliveryId
      ) {
        throw new Error('Missing data');
      }

      const products = await Product.exec((db) => db.whereIn('id', productIds));
      if (!products || products.length !== productIds.length) throw new Error('Products not found');

      const delivery = await Delivery.findOne({id: deliveryId});
      if (!delivery) throw new Error('Delivery not found');

      const customer = await Customer.findOne({id: customerStripeId});
      if (!customer) throw new Error('Customer not found');

      const totalPrice =
        products.reduce((total, product) => total + product.price, 0) +
        delivery.price;

      const totalPricePence = totalPrice * 100;

      // const description =
      //   products.reduce((desc, product) => `${desc}${product.name}: £${product.price}, `, '') +
      //   `${delivery.title}: £${delivery.price}`;

      const paymentIntent = await Order.createIntent(totalPricePence);


      ctx.body = {secret: paymentIntent.client_secret};
    });

  // const order = await Order.create(totalPricePence, customer.id, customer.default_source, description);
};

module.exports = registerProductRoutes;

const Product = require('../models/Product');
const Delivery = require('../models/Delivery');
const Customer = require('../models/Customer');
const Order = require('../models/Order');

const registerProductRoutes = (router) => {
  router
    .post('/order/intent', async (ctx, next) => {
      const {
        // customerStripeId,
        products: orderedProducts = [],
        deliveryId,
      } = ctx.request.body;

      if (
        // !customerStripeId ||
        orderedProducts.length === 0 ||
        !deliveryId
      ) {
        throw new Error('Missing data');
      }

      // const customer = await Customer.findOne({id: customerStripeId});
      // if (!customer) throw new Error('Customer not found');

      let products = await Product.exec((db) => db.whereIn('id', orderedProducts.map((p) => p.id)));
      if (!products || products.length !== orderedProducts.length) throw new Error('Products not found');

      const delivery = await Delivery.findOne({id: deliveryId});
      if (!delivery) throw new Error('Delivery not found');

      products = products.map((p) => {
        const newProduct = p;
        newProduct.quantity = orderedProducts.find((pp) => pp.id === p.id).quantity;
        return newProduct;
      });

      const totalPrice =
        products.reduce((total, product) => total + product.price * product.quantity, 0) +
        delivery.price;

      const totalPricePence = totalPrice * 100;

      const description =
        products
          .filter((p) => p.quantity > 0)
          .reduce((desc, product) => `${desc}${product.name}: £${product.price} x${product.quantity}, `, '') +
        `${delivery.title}: £${delivery.price}`;

      const paymentIntent = await Order.createIntent(totalPricePence, description, JSON.stringify({orderedProducts, deliveryId}));

      ctx.body = {secret: paymentIntent.client_secret};
    })
    .post('/order/finalise', async (ctx, next) => {
      const {
        name,
        phone,
        addressLineOne,
        addressCity,
        addressPostalCode,
        notes,
        intent: intentId,
      } = ctx.request.body;

      const intent = await Order.getIntent(intentId);

      if (intent.status !== 'succeeded') {
        throw new Error('Finalise called before payment complete');
      }

      const data = JSON.parse(intent.metadata.data);

      await Order.create({
        name,
        phone,
        address_line_one: addressLineOne,
        address_city: addressCity,
        address_postal_code: addressPostalCode,
        notes,
        delivery_id: data.deliveryId,
      }, data.orderedProducts.map((p) => ({
        product_id: p.id,
        quantity: p.quantity,
      })));

      ctx.body = {success: true};
    });
};

module.exports = registerProductRoutes;

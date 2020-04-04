const User = require('../models/User');

const registerProductRoutes = (router) => {
  router
    .post('/user/login', async (ctx, next) => {
      const {
        email,
        password,
      } = ctx.request.body;

      if (!email) {
        throw new Error('Email address invalid');
      }

      if (!password) {
        throw new Error('Password invalid');
      }

      const jwt = await User.login(email, password);
      return ctx.body = {
        jwt,
      };
    })
    .get('/user', async (ctx, next) => {
      return ctx.body = ctx.user;
    });
};

module.exports = registerProductRoutes;

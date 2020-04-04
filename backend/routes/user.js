const User = require('../models/User');

const registerUserRoutes = (router) => {
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

      const login = await User.login(email, password);
      return ctx.body = login;
    });
};

module.exports = registerUserRoutes;

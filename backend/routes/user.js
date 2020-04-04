const registerUserRoutes = (router) => {
  router
    .get('/user', async (ctx, next) => {
      return ctx.body = true;
    });
};

module.exports = registerUserRoutes;

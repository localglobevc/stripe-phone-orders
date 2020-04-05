require('dotenv').config();
const send = require('koa-send');
const Koa = require('koa');
const app = new Koa();
const Router = require('@koa/router');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const jwt = require('jsonwebtoken');

const registerUserRoutes = require('./routes/user.js');
const registerProductRoutes = require('./routes/product.js');
const registerCustomerRoutes = require('./routes/customer.js');
const User = require('./models/User');

const {
  SECRET,
} = process.env;

app
  .use(bodyParser())
  .use(cors());

const router = new Router();

// Safe error handling
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    ctx.body = JSON.stringify({
      error: e.message,
    });
    ctx.response.status = 500;
  }
});

// Urls to allow without authentication
const publicUrls = [
  '/user/login',
];

// Ensure user is authenticated
app.use(async (ctx, next) => {
  const authorization = ctx.request.header.authorization;

  let user = false;
  try {
    const authUser = jwt.verify(authorization, SECRET);
    user = await User.checkUser(authUser.email, authUser.password);
    ctx.user = jwt.decode(authorization);
  } finally {
    if (user || publicUrls.indexOf(ctx.url) > -1) {
      await next();
    } else {
      throw new Error('User not authenticated');
    }
  }
});

// Register app routes
registerUserRoutes(router);
registerProductRoutes(router);
registerCustomerRoutes(router);

app
  .use(router.routes())
  .use(router.allowedMethods());

// Static files
app.use(async (ctx) => {
  return await send(ctx, ctx.path, {root: __dirname + '/public'});
});

app.listen(3000);

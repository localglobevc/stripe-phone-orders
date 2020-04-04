const send = require('koa-send');
const Koa = require('koa');
const app = new Koa();
const Router = require('@koa/router');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');

const registerUserRoutes = require('./routes/user.js');

const {} = process.env;

app
  .use(bodyParser())
  .use(cors());

const router = new Router();

registerUserRoutes(router);

app
  .use(router.routes())
  .use(router.allowedMethods());

// Static files
app.use(async (ctx) => {
  return await send(ctx, ctx.path, {root: __dirname + '/public'});
});

app.listen(3000);

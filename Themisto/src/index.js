const Koa = require("koa");
const Cors = require("@koa/cors");
const koaBody = require('koa-body');
const config = require("./config/config");
const RouterInit = require("./Routes/RouterInit");
const http = require("http");
const Token = require("./Request/Token");

console.log(`Initializing ${config.name}`);

// Objeto de aplicacion
const app = new Koa();

// enable CORS - Cross Origin Resource Sharing
app.use(Cors());
// Enable BodyParser for POST parameters
app.use(koaBody());

http.createServer(app.callback()).listen(config.port);

Token.getToken().then(() => {
  // Incializacion de las rutas
  console.log(`Initializing Router`);
  const Router = new RouterInit();

  app.use(Router.publicInstance.routes());
  app.use(Router.publicInstance.allowedMethods());
});


const Koa = require("koa");
const Cors = require("@koa/cors");
const koaBody = require('koa-body');
const config = require("./config/config");
const RouterInit = require("./Routes/RouterInit");
const http = require("http");
const db = require("./Db/db");

console.log(`Initializing ${config.name}`);

// Objeto de aplicacion
const app = new Koa();

// enable CORS - Cross Origin Resource Sharing
app.use(Cors());
// Enable BodyParser for POST parameters
app.use(koaBody());

// Incializacion de la DB
new db.InitDB();

// Incializacion de las rutas
console.log(`Initializing Router`);
const Router = new RouterInit();

app.use(Router.publicInstance.routes());
app.use(Router.publicInstance.allowedMethods());

app.use(Router.privateInstance.routes());
app.use(Router.privateInstance.allowedMethods());

http.createServer(app.callback()).listen(config.port);

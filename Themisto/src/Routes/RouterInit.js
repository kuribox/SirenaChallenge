const KoaRouter = require("koa-router");
const Order = require("./Public/Order");
const testCallback = require("./Public/TestCallback");

module.exports = class Router {
  constructor() {
    this.publicInstance = new KoaRouter(); // Crea la nueva instancia del router
    this._initPublicAPI();
  }

  // Inicializa la parte publica de la API
  _initPublicAPI() {
    console.log("Initializing Public API");
    this.publicInstance.get("/", (ctx, next) => {
      ctx.body = 'Working!';
    });

    this.publicInstance.post("/api/order", Order);
    this.publicInstance.post("/api/testCallback", testCallback);
  }
}
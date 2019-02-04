const KoaRouter = require("koa-router");
const ProductSearch = require("./Public/ProductSearch");
const ProductSeachOrderList = require("./Public/ProductSeachOrderList");
const ProductCategory = require("./Public/ProductCategory");
const ProductSearchOrder = require("./Public/ProductSearchOrder");
const Login = require("./Public/Login");

const AuthMiddleware = require("./Private/AuthMiddleware");
const OrderStatus = require("./Private/OrderStatus");
const OrderProducts = require("./Private/OrderProducts");


module.exports = class Router {
  constructor() {
    this.publicInstance = new KoaRouter(); // Crea la nueva instancia del router
    this.privateInstance = new KoaRouter(); // Crea la nueva instancia del router para la API privada
    this._initPublicAPI();
    this._initPrivateAPI();
  }

  _initPrivateAPI() {
    console.log("Initializing Private API");

    // Carga del Middleware de autorizacion a la API privada
    this.privateInstance.use(AuthMiddleware);
    this.privateInstance.post("/private/order/status/:status", OrderStatus);
    this.privateInstance.post("/private/order/products", OrderProducts);
  }

  // Inicializa la parte publica de la API
  _initPublicAPI() {
    console.log("Initializing Public API");
    this.publicInstance.get("/", (ctx, next) => {
      ctx.body = 'Working!';
    });
    
    this.publicInstance.post("/api/login", Login);

    this.publicInstance.post("/api/product/search", ProductSearch);
    this.publicInstance.get("/api/product/search-order/list", ProductSeachOrderList);
    this.publicInstance.get("/api/product/search-order/:id", ProductSearchOrder);
    this.publicInstance.get("/api/product/category/:id", ProductCategory);
  }
}
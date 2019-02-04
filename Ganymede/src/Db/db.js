const mongoose = require("mongoose");
const config = require("../config/config");
const UserModel = require('./Models/Users.model');
const SearchOrderModel = require('./Models/SearchOrder.model');
const CategoryModel = require('./Models/Category.model');
const ProductsModel = require('./Models/Products.model');

exports.db = null; // Objeto de base de datos

exports.InitDB = class InitDB {
  constructor() {
    if (!exports.db) {
      // Carga los promise de mongoose
      mongoose.Promise = Promise;

      const connectionString = `mongodb://${config.db.server}:${config.db.port}/${config.db.name}`;

      console.log('Connecting to mongoDB database');

      // connect to mongo db
      mongoose.connect(connectionString, {
        keepAlive: true,
        useNewUrlParser: true
      }, (err) => {
        if (err) {
          return console.error(err);
        }

        // reconfigura el logger despues de cargar la db
        return console.log('Contected to DB');
      });

      exports.db = mongoose;
    }
  }
}

exports.userModel = UserModel;
exports.searchOrderModel = SearchOrderModel;
exports.categoryModel = CategoryModel;
exports.productsModel = ProductsModel;

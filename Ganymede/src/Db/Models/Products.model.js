const mongoose = require("mongoose");
const CategoryModel = require("./Category.model");

/**
 * ProductsSchema Schema
 */
const ProductsSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { title: Number },
  SKU: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'category'},
  description: { type: String, required: true }
});

/**
 * Statics
 */
ProductsSchema.statics = {
  getByCategoryId(id) {
    return this.find({ category: id }).lean();
  },

  // Actualiza o agrega productos
  updateProducts(products) {
    // Pide las categorias
    return CategoryModel.getAll().then((categories) => {
      let bulkCategoryFlag = false; // flag para ejecutar el guardado de categorias en caso de existir alguna nueva

      // simplifica un array con solo los nombres de las categorias
      const categoriesArray = categories.map((element) => {
        return element.name;
      });

      // simplifica un array con solo los nombres de los productos
      const nameArray = products.map((element) => {
        return element.title
      });

      // Crea los Bulk para la grabacion
      const bulk = this.collection.initializeUnorderedBulkOp();
      const bulkCategory = CategoryModel.collection.initializeUnorderedBulkOp();

      for ([key, value] of Object.entries(nameArray)) {
        // Obtiene el categoryId, de existir
        let categoryId = null;
        const categoryIndex = categoriesArray.indexOf(products[key].category);

        if (categoryIndex < 0) {
          // De no existir la cateogira, se prepara para crearla
          categoryId = new mongoose.mongo.ObjectId();
          categoriesArray.push(products[key].category);
          bulkCategory.insert({_id: categoryId, name: products[key].category}); // agrega la categoria
          bulkCategoryFlag = true;
        } else {
          categoryId = categories[categoryIndex]._id;
        }

        bulk.find({title: value}).upsert().updateOne(Object.assign(products[key], {category: categoryId})); // Agrega el producto
      }
  
      // Ejecuta las grabaciones
      return new Promise((resolve, reject) => {
        if (bulkCategoryFlag) {
          bulkCategory.execute((err) => {
            if (err) {
              return reject(err);
            }
            bulk.execute((err) => {
              if (err) {
                return reject(err);
              }
              return resolve();
            });
          });
        } else {
          bulk.execute((err) => {
            if (err) {
              return reject(err);
            }
            return resolve();
          });
        }
      });
    });
  },
};

module.exports = mongoose.model('products', ProductsSchema);

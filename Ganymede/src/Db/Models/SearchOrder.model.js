const mongoose = require("mongoose");

/**
 * SearchOrder Schema
 */
const SearchOrderSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  searchData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  products: {
    type: mongoose.Schema.Types.Mixed,
  }
});

/**
 * Statics
 */
SearchOrderSchema.statics = {
  // Carga una nueva orden
  LoadOrder(status, data, products) {
    const newId = new mongoose.mongo.ObjectId();

    const newOder = new this({
      _id: newId, 
      searchData: data,
      status: status,
      products: products
    });

    return newOder.save().then((a, b) => {
      return Promise.resolve(newId);
    }).catch(() => {
      return Promise.resolve(null);
    });
  },

  getById(id) {
    return this.findOne({ _id: id }).lean();
  },

  getAll(id) {
    return this.find().lean();
  },

  // Cambia el estado de una orden
  setOrderStatus(id, status) {
    return this.updateOne({_id: String(id)}, { status: status }, { multi: true })
  },

  // actualiza los productos de una orden
  setOrderProducts(id, products) {
    return this.updateOne({_id: String(id)}, { products: products }, { multi: true })
  }
};

module.exports = mongoose.model('searchOrder', SearchOrderSchema);

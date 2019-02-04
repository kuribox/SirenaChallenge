const mongoose = require("mongoose");

/**
 * CategorySchema Schema
 */
const CategorySchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: { type: String, required: true }
});

/**
 * Statics
 */
CategorySchema.statics = {
  getAll() {
    return this.find().lean();
  }
};

module.exports = mongoose.model('category', CategorySchema);

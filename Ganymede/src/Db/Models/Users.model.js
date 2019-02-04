const mongoose = require("mongoose");

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  username: {
    type: String
  },
  password: {
    type: String,
    required: true
  }
});

/**
 * Statics
 */
UserSchema.statics = {
  existCredential(value, password) {
    return this.findOne({ user: value, password }).select({ password: 0 }).then(user => new Promise((resolve) => {
      if (user) {
        return resolve({ exists: true, user: user });
      }
      return resolve(false);
    }));
  }
};

module.exports = mongoose.model('users', UserSchema);

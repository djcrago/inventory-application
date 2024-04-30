const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, minLength: 3, maxLength: 100, required: true },
});

CategorySchema.virtual('url').get(function () {
  return `/inventory/category/${this.name}`;
});

module.exports = mongoose.model('Category', CategorySchema);

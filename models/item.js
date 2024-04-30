const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, minLength: 3, maxLength: 100, required: true },
  description: { type: String, minLength: 3, maxLength: 200, required: true },
  category: [{ type: Schema.Types.ObjectId, ref: 'Category', required: true }],
  price: { type: Number, min: 0, required: true },
  number_in_stock: { type: Number, min: 0, max: 100, required: true },
  ages: { type: String, required: true },
});

ItemSchema.virtual('url').get(function () {
  return `/inventory/item/${this._id}`;
});

module.exports = mongoose.model('Item', ItemSchema);

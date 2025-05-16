const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
  uuid: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    maxlength: 50,
    trim: true
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    maxlength: 30,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 1
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      enum: ['men', 'women', 'kids', 'unisex'],
      required: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 90,
    },
    stock: {
      type: Number,
      default: 10,
      min: 0,
    },
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL'],
    },
    colors: {
      type: [String],
      default: ['Black', 'White', 'Blue'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Product', productSchema);

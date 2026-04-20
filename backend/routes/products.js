const express = require('express');

const Product = require('../models/Product');
const { authGuard, requireRole } = require('../middleware/auth');

const publicProductRouter = express.Router();
const adminProductRouter = express.Router();

function sanitizeProduct(product) {
  return {
    id: product._id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    image: product.image,
    discount: product.discount,
    stock: product.stock,
    sizes: product.sizes,
    colors: product.colors,
    featured: product.featured,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

function normalizeArrayValue(value, fallback) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return fallback;
}

function mapProductPayload(body) {
  return {
    name: body.name?.trim(),
    description: body.description?.trim() || '',
    price: Number(body.price),
    category: body.category,
    image: body.image?.trim(),
    discount: Number(body.discount || 0),
    stock: Number(body.stock || 0),
    sizes: normalizeArrayValue(body.sizes, ['S', 'M', 'L', 'XL']),
    colors: normalizeArrayValue(body.colors, ['Black', 'White', 'Blue']),
    featured: Boolean(body.featured),
  };
}

function validateProductPayload(payload) {
  if (!payload.name || !payload.image || !payload.category) {
    return 'Name, image, and category are required.';
  }

  if (Number.isNaN(payload.price) || payload.price < 0) {
    return 'Price must be a valid positive number.';
  }

  if (Number.isNaN(payload.discount) || payload.discount < 0 || payload.discount > 90) {
    return 'Discount must be between 0 and 90.';
  }

  if (Number.isNaN(payload.stock) || payload.stock < 0) {
    return 'Stock must be zero or more.';
  }

  return null;
}

publicProductRouter.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ products: products.map(sanitizeProduct) });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load products.' });
  }
});

publicProductRouter.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.json({ product: sanitizeProduct(product) });
  } catch (error) {
    return res.status(404).json({ message: 'Product not found.' });
  }
});

adminProductRouter.use(authGuard, requireRole('admin'));

adminProductRouter.post('/products', async (req, res) => {
  try {
    const payload = mapProductPayload(req.body);
    const validationError = validateProductPayload(payload);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const product = await Product.create(payload);
    return res.status(201).json({
      message: 'Product created successfully.',
      product: sanitizeProduct(product),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create product.' });
  }
});

adminProductRouter.put('/products/:id', async (req, res) => {
  try {
    const payload = mapProductPayload(req.body);
    const validationError = validateProductPayload(payload);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.json({
      message: 'Product updated successfully.',
      product: sanitizeProduct(product),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update product.' });
  }
});

adminProductRouter.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete product.' });
  }
});

module.exports = {
  publicProductRouter,
  adminProductRouter,
};

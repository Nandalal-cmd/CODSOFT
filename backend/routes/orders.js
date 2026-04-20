const express = require('express');
const { authGuard, requireRole } = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');

const router = express.Router();

// Create a new order (authenticated users)
router.post('/', authGuard, async (req, res) => {
  try {
    const { items, paymentMethod, shippingAddress } = req.body;

    if (!items || !items.length || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Securely calculate total amount from DB prices
    let calculatedTotal = 0;
    const processedItems = [];

    for (const item of items) {
      const dbProduct = await Product.findById(item.product);
      if (!dbProduct) {
        return res.status(404).json({ message: `Product ${item.name} not found.` });
      }

      const price = dbProduct.price;
      const discount = dbProduct.discount || 0;
      const finalPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
      
      calculatedTotal += finalPrice * item.quantity;
      
      processedItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        price: finalPrice,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
      });
    }

    const order = new Order({
      user: req.user._id,
      items: processedItems,
      totalAmount: calculatedTotal,
      paymentMethod,
      shippingAddress,
    });

    if (paymentMethod === 'upi' || paymentMethod === 'paytm') {
      order.paymentStatus = 'paid';
    }

    await order.save();

    res.status(201).json({
      message: 'Order placed successfully',
      order: {
        id: order._id,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// Get current user's orders (authenticated users)
router.get('/', authGuard, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name image price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Admin: Get all orders
router.get('/admin/all', authGuard, requireRole('admin'), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name image price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Admin: Update order status
router.patch('/admin/:id/status', authGuard, requireRole('admin'), async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const update = {};

    if (orderStatus) update.orderStatus = orderStatus;
    if (paymentStatus) update.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order updated successfully', order });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Failed to update order' });
  }
});

module.exports = router;

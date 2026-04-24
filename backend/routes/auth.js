const express = require('express');
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
const Order = require('../models/Order');

const User = require('../models/User');
const { authGuard, requireRole } = require('../middleware/auth');

const userRouter = express.Router();
const adminRouter = express.Router();

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET || 'stylecart-dev-secret',
    { expiresIn: '7d' },
  );
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

function validateAuthBody(body) {
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return 'Name, email, and password are required.';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters long.';
  }

  return null;
}

function buildRegisterHandler(role) {
  return async (req, res) => {
    try {
      const validationError = validateAuthBody(req.body);
      if (validationError) {
        return res.status(400).json({ message: validationError });
      }

      const { name, email, password } = req.body;
      const normalizedEmail = email.toLowerCase().trim();
      const existingUser = await User.findOne({ where: { email: normalizedEmail } });

      if (existingUser) {
        return res.status(409).json({ message: 'An account with this email already exists.' });
      }

      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        role,
      });

      return res.status(201).json({
        message: `${role === 'admin' ? 'Admin' : 'User'} account created successfully.`,
        token: createToken(user),
        user: sanitizeUser(user),
      });
    } catch (error) {
      return res.status(500).json({ message: 'Unable to create account right now.' });
    }
  };
}

function buildLoginHandler(role) {
  return async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const user = await User.findOne({ where: { email: normalizedEmail } });

      if (!user || user.role !== role) {
        return res.status(401).json({ message: 'Invalid credentials for this portal.' });
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      return res.json({
        message: 'Login successful.',
        token: createToken(user),
        user: sanitizeUser(user),
      });
    } catch (error) {
      return res.status(500).json({ message: 'Unable to login right now.' });
    }
  };
}

async function getAdminOverview(req, res) {
  try {
    const [customerCount, adminCount, productCount, orderCount, recentUsers, recentOrders, totalRevenue] = await Promise.all([
      User.count({ where: { role: 'user' } }),
      User.count({ where: { role: 'admin' } }),
      Product.count(),
      Order.count(),
      User.findAll({ order: [['createdAt', 'DESC']], limit: 5 }),
      Order.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5,
        include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
      }),
      Order.sum('totalAmount', { where: { paymentStatus: 'paid' } }),
    ]);

    res.json({
      stats: {
        customerCount,
        adminCount,
        productCount,
        orderCount,
        totalRevenue,
      },
      recentUsers: recentUsers.map(sanitizeUser),
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        user: o.user ? { name: o.user.name, email: o.user.email } : null,
        totalAmount: o.totalAmount,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        orderStatus: o.orderStatus,
        createdAt: o.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load admin overview.' });
  }
}

userRouter.post('/register', buildRegisterHandler('user'));
userRouter.post('/login', buildLoginHandler('user'));
userRouter.get('/me', authGuard, requireRole('user'), (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

adminRouter.post('/login', buildLoginHandler('admin'));
adminRouter.get('/me', authGuard, requireRole('admin'), (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});
adminRouter.get('/overview', authGuard, requireRole('admin'), getAdminOverview);

module.exports = {
  userRouter,
  adminRouter,
};

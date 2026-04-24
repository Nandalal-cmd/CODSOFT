require('dotenv').config();
const express = require('express');
const { Sequelize } = require('sequelize');
const cors = require('cors');

const { userRouter, adminRouter } = require('./routes/auth');
const { publicProductRouter, adminProductRouter } = require('./routes/products');
const orderRouter = require('./routes/orders');
const { Product, User, Order } = require('./models');
const defaultProducts = require('./data/defaultProducts');

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'StyleCart API is healthy' });
});

app.use('/api/auth', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/products', publicProductRouter);
app.use('/api/admin', adminProductRouter);
app.use('/api/orders', orderRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: 'Something went wrong on the server.',
  });
});

async function ensureSystemAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME?.trim() || 'StyleCart Admin';

  if (!adminEmail || !adminPassword) {
    console.log('Admin bootstrap skipped. Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env.');
    return;
  }

  if (adminPassword.length < 6) {
    throw new Error('ADMIN_PASSWORD must be at least 6 characters long.');
  }

  const existingAdmin = await User.findOne({ where: { email: adminEmail } });

  if (!existingAdmin) {
    await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });
    console.log(`System admin created for ${adminEmail}`);
    return;
  }

  let shouldSave = false;

  if (existingAdmin.role !== 'admin') {
    existingAdmin.role = 'admin';
    shouldSave = true;
  }

  if (existingAdmin.name !== adminName) {
    existingAdmin.name = adminName;
    shouldSave = true;
  }

  const passwordMatches = await existingAdmin.comparePassword(adminPassword);
  if (!passwordMatches) {
    existingAdmin.password = adminPassword;
    shouldSave = true;
  }

  if (shouldSave) {
    await existingAdmin.save();
    console.log(`System admin synced for ${adminEmail}`);
  }
}

async function startServer() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is missing. Add it to backend/.env before starting the server.');
  }

  const sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: false,
  });

  await sequelize.authenticate();
  console.log('PostgreSQL connected');

  // Sync models
  await sequelize.sync();

  // Make sequelize available to models
  require('./models').init(sequelize);

  await ensureSystemAdmin();
  const existingProducts = await Product.count();
  if (existingProducts === 0) {
    await Product.bulkCreate(defaultProducts);
    console.log('Default products seeded');
  }

  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`StyleCart API running on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});

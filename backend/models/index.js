const { Sequelize } = require('sequelize');
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');

let sequelize;

function init(db) {
  sequelize = db;
  User.init(sequelize);
  Product.init(sequelize);
  Order.init(sequelize);

  // Define associations
  Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  User.hasMany(Order, { foreignKey: 'userId' });

  // Sync associations
  sequelize.sync();
}

module.exports = {
  init,
  User,
  Product,
  Order,
};
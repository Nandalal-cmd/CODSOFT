const { DataTypes, Model } = require('sequelize');

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id',
          },
        },
        items: {
          type: DataTypes.JSON,
          allowNull: false,
        },
        totalAmount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        paymentMethod: {
          type: DataTypes.ENUM('cod', 'upi', 'paytm'),
          allowNull: false,
        },
        paymentStatus: {
          type: DataTypes.ENUM('pending', 'paid', 'failed'),
          defaultValue: 'pending',
        },
        orderStatus: {
          type: DataTypes.ENUM('placed', 'processing', 'shipped', 'delivered', 'cancelled'),
          defaultValue: 'placed',
        },
        shippingAddress: {
          type: DataTypes.JSON,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'Order',
        timestamps: true,
      },
    );
  }
}

module.exports = Order;
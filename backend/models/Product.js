const { DataTypes, Model } = require('sequelize');

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        description: {
          type: DataTypes.TEXT,
          defaultValue: '',
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          validate: {
            min: 0,
          },
        },
        category: {
          type: DataTypes.ENUM('men', 'women', 'kids', 'unisex'),
          allowNull: false,
        },
        image: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        images: {
          type: DataTypes.JSON,
          defaultValue: [],
        },
        discount: {
          type: DataTypes.DECIMAL(5, 2),
          defaultValue: 0,
          validate: {
            min: 0,
            max: 90,
          },
        },
        stock: {
          type: DataTypes.INTEGER,
          defaultValue: 10,
          validate: {
            min: 0,
          },
        },
        sizes: {
          type: DataTypes.JSON,
          defaultValue: ['S', 'M', 'L', 'XL'],
        },
        colors: {
          type: DataTypes.JSON,
          defaultValue: ['Black', 'White', 'Blue'],
        },
        featured: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
        modelName: 'Product',
        timestamps: true,
      },
    );
  }
}

module.exports = Product;

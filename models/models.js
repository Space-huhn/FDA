const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, unique: false, allowNull: false, validate: {notEmpty: true}},
  email: {type: DataTypes.STRING, unique: true, allowNull: false, validate: {notEmpty: true}},
  password: {type: DataTypes.STRING, allowNull: false, validate: {notEmpty: true}},
  role: {type: DataTypes.STRING, defaultValue: 'USER'},
  avatar: {type: DataTypes.STRING},
  address: {type: DataTypes.STRING},
  isVerified: {type: DataTypes.BOOLEAN, defaultValue: false},
})

const Card = sequelize.define('card', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const CardProduct = sequelize.define('card_product', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Restaurant = sequelize.define('restaurant', {
  id: {type: DataTypes.INTEGER, primaryKey: true, foreignKey: 'restaurantId', autoIncrement: true, onDelete: "CASCADE"},
  name: {type: DataTypes.STRING, unique: true, allowNull: false},
  description: {type: DataTypes.STRING},
  rating: {type: DataTypes.FLOAT, defaultValue: 0},
  deliveryTime: {type: DataTypes.INTEGER},
  deliveryPrice: {type: DataTypes.FLOAT},
  image: {type: DataTypes.STRING},
})

const Product = sequelize.define('product', {
  id: {type: DataTypes.INTEGER, primaryKey: true, foreignKey: "product_id", autoIncrement: true},
  name: {type: DataTypes.STRING, allowNull: false},
  description: {type: DataTypes.STRING},
  price: {type: DataTypes.FLOAT},
  ingredients: {type: DataTypes.ARRAY(DataTypes.INTEGER)},
  image: {type: DataTypes.STRING},
  restaurantId: {type: DataTypes.INTEGER, foreignKey: true, allowNull: false},
  categoryId: {type: DataTypes.INTEGER, foreignKey: true, allowNull: false},
})

// const RestaurantContact = sequelize.define('restaurant_contact', {
//   id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
//   email: {type: DataTypes.STRING},
//   tel: {type: DataTypes.STRING, allowNull: false},
// })
//
// const RestaurantProduct = sequelize.define('restaurant_product', {
//   id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
// })

const ProductsCategories = sequelize.define('products_categories', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, allowNull: false, unique: true},
  image: {type: DataTypes.STRING, allowNull: false},
})

const Orders = sequelize.define('orders', {
  id: {type: DataTypes.INTEGER, primaryKey: true, foreignKey: "order_id", autoIncrement: true},
  user_id: {type: DataTypes.INTEGER, allowNull: false},
  price: {type: DataTypes.FLOAT, allowNull: false},
  deliveryAddress: {type: DataTypes.STRING, allowNull: false},
  status: {type: DataTypes.ENUM("Pending", "Processing", "Completed", "Cancelled"), allowNull: false},
})

const OrderItems = sequelize.define('order_items', {
  id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false},
  order_id: {type: DataTypes.INTEGER, foreignKey: true, allowNull: false},
  product_id: {type: DataTypes.INTEGER, foreignKey: true, allowNull: false},
  quantity: {type: DataTypes.INTEGER, allowNull: false},
  price: {type: DataTypes.FLOAT, allowNull: false},
})


User.hasOne(Card)
Card.belongsTo(User)

Card.hasMany(CardProduct)
CardProduct.belongsTo(Card)

Product.hasMany(CardProduct)
CardProduct.belongsTo(Product)

// Restaurant.belongsToMany(Product, {through: RestaurantProduct})
// Product.belongsToMany(Restaurant, {through: RestaurantProduct})

Restaurant.hasMany(Product);
Product.belongsTo(Restaurant);

Orders.hasMany(OrderItems);
OrderItems.belongsTo(Orders);

OrderItems.belongsTo(Product);
Product.hasMany(OrderItems);


// RestaurantContact.hasOne(Restaurant)
// Restaurant.belongsTo(RestaurantContact)

Product.hasOne(ProductsCategories)
// ProductsCategories.hasMany(Product)

module.exports = {
  User,
  Card,
  CardProduct,
  Restaurant,
  Product,
  // RestaurantProduct,
  // RestaurantContact,
  ProductsCategories,
  Orders,
  OrderItems
}






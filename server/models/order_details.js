module.exports = (sequelize, DataTypes) => {
  const Order_Details = sequelize.define('Order_Details', {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    subtotal_price_cents: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  Order_Details.associate = (models) => {
    Order_Details.belongsTo(models.Orders, {foreignKey: 'ordersId', as: 'orders'});
    Order_Details.belongsTo(models.Fruits, {foreignKey: 'fruitsId', as: 'fruits'});
  };
  return Order_Details;
};
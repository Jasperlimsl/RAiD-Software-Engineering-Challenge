module.exports = (sequelize, DataTypes) => {
  const Orders = sequelize.define('Orders', {
    total_price_cents: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fulfilled: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  });
  Orders.associate = (models) => {
    Orders.belongsTo(models.Users, { foreignKey: 'usersId', as: 'users'});
    Orders.hasMany(models.Order_Details, {foreignKey: 'ordersId', as: 'orderDetails'});
  };
  return Orders;
}
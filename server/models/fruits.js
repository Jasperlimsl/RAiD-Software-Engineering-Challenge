module.exports = (sequelize, DataTypes) => {
  const Fruits = sequelize.define('Fruits', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    price_cents: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  })
  Fruits.associate = (models) => {
    Fruits.hasMany(models.Order_Details, {foreignKey: 'fruitsId', as: 'orderDetails'});
  };
  return Fruits;
};
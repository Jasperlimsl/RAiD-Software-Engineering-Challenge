module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM,
      values: ['customer', 'admin'],
      allowNull: false
    }
  });
  Users.associate = (models) => {
    Users.hasMany(models.Orders, { foreignKey: 'usersId', as: 'orders'});
  };
  return Users;
};
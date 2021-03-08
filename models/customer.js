module.exports = function (sequelize, DataTypes) {
  var Customer = sequelize.define('Customer', {
    customer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numBurgersEaten: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });
  Customer.associate = function (models) {
    Customer.hasMany(models.Burger);
  };
  return Customer;
};

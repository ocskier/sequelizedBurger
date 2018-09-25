module.exports = function(sequelize, DataTypes) {
  var Burger = sequelize.define("Burger", {
    burger_name: DataTypes.STRING,
    isEaten: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
  });
  return Burger;
};
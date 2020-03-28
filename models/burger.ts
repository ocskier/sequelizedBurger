import { Sequelize } from "sequelize";

export interface BurgerType{
  id: string;
  burger_name: string;
  isEaten: Boolean
}

module.exports = function(sequelize: Sequelize, DataTypes: any) {
  var Burger = sequelize.define("Burger", {
    burger_name: DataTypes.STRING,
    isEaten: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
  });
  return Burger;
};
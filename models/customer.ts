import { Sequelize, Model, ModelCtor } from 'sequelize';

export interface CustomerType {
  id: string;
  customer: string;
  numBurgersEaten: Number;
}

module.exports = function (sequelize: Sequelize, DataTypes: any) {
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
  return Customer;
};

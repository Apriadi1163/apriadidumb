"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class chatdumb extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      chatdumb.belongsTo(models.user, {
        as: "sender",
        foreignKey: {
          name: "idSender",
        },
      });
      chatdumb.belongsTo(models.user, {
        as: "recipient",
        foreignKey: {
          name: "idRecipient",
        },
      });
    }
  }
  chatdumb.init(
    {
      message: DataTypes.TEXT,
      idSender: DataTypes.INTEGER,
      idRecipient: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "chatdumb",
    }
  );
  return chatdumb;
};

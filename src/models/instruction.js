"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Instruction extends Model {
    static associate(models) {
      Instruction.belongsTo(models.Recipe, { foreignKey: "recipeId" });
    }
  }
  Instruction.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      recipeId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Recipe",
          key: "id",
        },
      },
      number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      step: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Instruction",
      tableName: "instructions",
      timestamps: false,
    }
  );
  return Instruction;
};

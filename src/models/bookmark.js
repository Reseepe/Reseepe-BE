"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Bookmark extends Model {
    static associate(models) {
      // define association here
      Bookmark.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      Bookmark.belongsTo(models.Recipe, {
        foreignKey: "recipeId",
        onDelete: "CASCADE",
      });
    }
  }

  Bookmark.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      recipeId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Bookmark",
      tableName: "bookmarks",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    }
  );

  return Bookmark;
};

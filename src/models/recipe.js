"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Recipe.belongsToMany(models.User, {
        through: models.Bookmark,
        foreignKey: "recipeId",
        otherKey: "userId",
      });
      Recipe.belongsToMany(models.Ingredient, {
        through: models.RecipeIngredient,
        foreignKey: "recipeId",
        otherKey: "ingredientId",
      });
      Recipe.hasMany(models.Instruction, {
        foreignKey: "recipeId",
      });
    }
  }
  Recipe.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ingredients: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      calories: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      photoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      instructions: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Recipe",
      tableName: "recipes",
      timestamps: false,
    }
  );

  return Recipe;
};

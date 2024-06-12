const express = require("express");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/jwt");
const { Op } = require("sequelize");
const { User, Recipe, Ingredient, Bookmark, RecipeIngredient } = require("../models");

exports.searchIngredients = async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({
        error: true,
        message: "Query parameter is required",
      });
    }

    const ingredients = await Ingredient.findAll({
      where: {
        [Op.or]: [{ name: { [Op.like]: `%${query}%` } }, { id: query }],
      },
      limit: 5,
    });

    res.json({
      error: false,
      message: "Successfully fetched ingredients",
      found: ingredients.length,
      ingredientList: ingredients.map((ingredient) => ({
        name: ingredient.name,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "An error occurred while searching for ingredients",
    });
  }
};

exports.getRecommendedRecipes = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find bookmarks of the user
    const user = await User.findByPk(userId, {
      include: {
        model: Recipe,
        through: {
          model: Bookmark,
          attributes: [],
        },
        include: {
          model: Ingredient,
          through: {
            model: RecipeIngredient,
            attributes: [], 
          },
          attributes: ["name", "description"],
        },
        attributes: ["id", "name", "description", "photoUrl", "instruction"],
      },
    });

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    const recommendedList = user.Recipes.map((recipe) => ({
      recipeId: recipe.id,
      name: recipe.name,
      description: recipe.description,
      ingredientList: recipe.Ingredients.map((ingredient) => ({
        name: ingredient.name,
        description: ingredient.description,
      })),
      photoUrl: recipe.photoUrl,
      instruction: recipe.instruction,
    }));

    return res.json({
      error: false,
      message: "Successfully fetched recommended recipes",
      recommendedList,
    });
  } catch (error) {
    console.error("Error fetching recommended recipes:", error);
    return res
      .status(500)
      .json({ error: true, message: "Failed to fetch recommended recipes" });
  }
};

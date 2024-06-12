const express = require("express");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/jwt");
const { Op } = require("sequelize");
const { User, Recipe, Ingredient, Bookmark } = require("../models");

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

exports.getRecommendedRecipes = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookmarks = await Bookmark.findAll({
      where: { userId },
      include: [
        {
          model: Recipe,
          include: [
            {
              model: Ingredient, // Assuming Recipe has many Ingredients
              through: { attributes: [] }, // Remove join table attributes
            },
          ],
        },
      ],
      limit: 5,
    });

    const recommendedList = bookmarks.map((bookmark) => {
      const recipe = bookmark.Recipe;
      return {
        recipeId: recipe.id,
        name: recipe.name,
        description: recipe.description,
        ingredientList: recipe.Ingredients.map((ingredient) => ({
          name: ingredient.name,
          description: ingredient.description,
        })),
        photoUrl: recipe.photoUrl,
        instruction: recipe.instruction,
      };
    });

    res.json({
      error: false,
      message: "Successfully retrieved recommended recipes",
      recommendedList,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "An error occurred while fetching recommended recipes",
      details: error.message,
    });
  }
};

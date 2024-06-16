const express = require("express");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/jwt");
const { Op } = require("sequelize");
const {
  User,
  Recipe,
  Ingredient,
  Instruction,
  Bookmark,
  RecipeIngredient,
} = require("../models");

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

    const recommendedRecipes = await Recipe.findAll({
      include: [
        {
          model: User,
          where: { id: userId },
          required: true,
          attributes: [],
          through: {
            attributes: [],
          },
        },
        {
          model: Ingredient,
          attributes: ["name", "description"],
          through: { attributes: [] },
        },
        {
          model: Instruction,
          attributes: ["number", "step"],
        },
      ],
      limit: 5,
    });

    const recommendedList = recommendedRecipes.map((recipe) => ({
      recipeId: recipe.id,
      name: recipe.name,
      description: recipe.description,
      ingredientList: recipe.Ingredients.map((ingredient) => ({
        name: ingredient.name,
        description: ingredient.description,
      })),
      photoUrl: recipe.photoUrl,
      instruction: recipe.Instructions.map((instruction) => ({
        step: instruction.step,
      })),
    }));

    res.status(200).json({
      error: false,
      message: "Successfully fetched recommended recipes",
      recommendedList,
    });
  } catch (error) {
    console.error("Error fetching recommended recipes:", error);
    res.status(500).json({
      error: true,
      message: "Failed to fetch recommended recipes",
    });
  }
};

exports.addBookmark = async (req, res) => {
  const { recipeId } = req.params;
  const userId = req.user.id;

  try {
    const existingBookmark = await Bookmark.findOne({
      where: {
        userId,
        recipeId,
      },
    });

    if (existingBookmark) {
      return res.status(400).json({
        error: true,
        message: "Recipe is already bookmarked",
      });
    }

    await Bookmark.create({
      userId,
      recipeId,
    });

    res.status(201).json({
      error: false,
      message: "Successfully bookmarked the recipe",
    });
  } catch (error) {
    console.error("Error bookmarking recipe:", error);
    res.status(500).json({
      error: true,
      message: "Failed to bookmark the recipe",
    });
  }
};

exports.getBookmarkedRecipes = async (req, res) => {
  try {
    const userId = req.user.id;

    const recommendedRecipes = await Recipe.findAll({
      include: [
        {
          model: User,
          where: { id: userId },
          required: true,
          attributes: [],
          through: {
            attributes: [],
          },
        },
        {
          model: Ingredient,
          attributes: ["name", "description"],
          through: { attributes: [] },
        },
        {
          model: Instruction,
          attributes: ["number", "step"],
        },
      ],
    });

    const recommendedList = recommendedRecipes.map((recipe) => ({
      recipeId: recipe.id,
      name: recipe.name,
      description: recipe.description,
      ingredientList: recipe.Ingredients.map((ingredient) => ({
        name: ingredient.name,
        description: ingredient.description,
      })),
      photoUrl: recipe.photoUrl,
      instruction: recipe.Instructions.map((instruction) => ({
        step: instruction.step,
      })),
    }));

    res.status(200).json({
      error: false,
      message: "Successfully fetched recommended recipes",
      recommendedList,
    });
  } catch (error) {
    console.error("Error fetching recommended recipes:", error);
    res.status(500).json({
      error: true,
      message: "Failed to fetch recommended recipes",
    });
  }
};

exports.getRecipes = async (req, res) => {
  try {
    const userId = req.user.id;

    const recommendedRecipes = await Recipe.findAll({
      include: [
        {
          model: User,
          where: { id: userId },
          required: true,
          attributes: [],
          through: {
            attributes: [],
          },
        },
        {
          model: Ingredient,
          attributes: ["name", "description"],
          through: { attributes: [] },
        },
        {
          model: Instruction,
          attributes: ["number", "step"],
        },
      ],
      limit: 5,
    });

    const recommendedList = recommendedRecipes.map((recipe) => ({
      recipeId: recipe.id,
      name: recipe.name,
      description: recipe.description,
      ingredientList: recipe.Ingredients.map((ingredient) => ({
        name: ingredient.name,
        description: ingredient.description,
      })),
      photoUrl: recipe.photoUrl,
      instruction: recipe.Instructions.map((instruction) => ({
        step: instruction.step,
      })),
    }));

    res.status(200).json({
      error: false,
      message: "Successfully fetched recommended recipes",
      recommendedList,
    });
  } catch (error) {
    console.error("Error fetching recommended recipes:", error);
    res.status(500).json({
      error: true,
      message: "Failed to fetch recommended recipes",
    });
  }
};
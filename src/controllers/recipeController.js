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
    // Ambil userId dari token yang terotentikasi
    const userId = req.user.id; // Sesuaikan dengan bagaimana Anda mengambil userId dari token

    // Ambil daftar resep yang direkomendasikan untuk pengguna
    const recommendedRecipes = await Recipe.findAll({
      include: [
        {
          model: User,
          where: { id: userId }, // Filter berdasarkan id pengguna yang sedang login
          required: true, // Memastikan hanya mengambil resep yang memiliki bookmark oleh pengguna
          attributes: [],
          through: {
            attributes: [], // Hilangkan kolom tambahan dari tabel jembatan
          },
        },
        {
          model: Ingredient,
          attributes: ["name", "description"],
          through: { attributes: [] }, // Hilangkan kolom tambahan dari tabel jembatan
        },
        {
          model: Instruction,
          attributes: ["number", "step"],
        },
      ],
    });

    // Format respons sesuai dengan kebutuhan
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

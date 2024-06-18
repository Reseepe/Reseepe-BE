const express = require("express");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
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

dotenv.config();

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
        [Op.or]: [{ name: { [Op.like]: `%${query}%` } }],
      },
    });

    const cleanedIngredients = ingredients.map((ingredient) => ({
      id: ingredient.id,
      name: ingredient.name.replace(/\r/g, ""),
    }));

    res.json({
      error: false,
      message: "Successfully fetched ingredients",
      found: cleanedIngredients.length,
      ingredientList: cleanedIngredients.map((ingredient) => ({
        id: ingredient.id,
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
  const userId = req.user.id;

  try {
    const recipes = await Recipe.findAll({
      limit: 5,
      attributes: [
        "id",
        "name",
        "duration",
        "description",
        "ingredients",
        "photoUrl",
        "instructions",
      ],
    });

    const userBookmarks = await Bookmark.findAll({
      where: { userId },
      attributes: ["recipeId"],
    });

    const bookmarkedRecipeIds = userBookmarks.map(
      (bookmark) => bookmark.recipeId
    );

    const recommendedRecipes = await Promise.all(
      recipes.map(async (recipe) => {
        let ingredientsArray = [];
        let instructionsArray = [];

        try {
          let ingredients = recipe.ingredients.trim();
          if (ingredients.startsWith("[") && ingredients.endsWith("]")) {
            ingredientsArray = JSON.parse(ingredients.replace(/'/g, '"'));
          } else {
            console.error(
              `Ingredients format is invalid for recipe ${recipe.id}`
            );
          }
        } catch (e) {
          console.error(
            `Error parsing ingredients for recipe ${recipe.id}:`,
            e
          );
        }

        try {
          let instructions = recipe.instructions.trim();
          if (instructions.startsWith("[") && instructions.endsWith("]")) {
            instructionsArray = JSON.parse(instructions.replace(/'/g, '"'));
          } else {
            console.error(
              `Instructions format is invalid for recipe ${recipe.id}`
            );
          }
        } catch (e) {
          console.error(
            `Error parsing instructions for recipe ${recipe.id}:`,
            e
          );
        }

        const isBookmarked = bookmarkedRecipeIds.includes(recipe.id);

        return {
          id: recipe.id,
          name: recipe.name,
          duration: recipe.duration,
          description: recipe.description,
          ingredients: ingredientsArray,
          isBookmarked: isBookmarked,
          photoUrl: recipe.photoUrl,
          instructions: instructionsArray,
        };
      })
    );

    res.status(200).json({
      error: false,
      message: "Succesfully retrieved the recommended recipes",
      recommendedList: recommendedRecipes,
    });
  } catch (error) {
    console.error("Error getting recommended recipes:", error);
    res.status(500).json({
      error: true,
      message: "Failed to get recommended recipes",
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

exports.removeBookmark = async (req, res) => {
  const { recipeId } = req.params;
  const userId = req.user.id;

  try {
    const existingBookmark = await Bookmark.findOne({
      where: {
        userId,
        recipeId,
      },
    });

    if (!existingBookmark) {
      return res.status(404).json({
        error: true,
        message: "Bookmark not found",
      });
    }

    await Bookmark.destroy({
      where: {
        userId,
        recipeId,
      },
    });

    res.status(200).json({
      error: false,
      message: "Successfully removed the bookmark",
    });
  } catch (error) {
    console.error("Error removing bookmark:", error);
    res.status(500).json({
      error: true,
      message: "Failed to remove the bookmark",
    });
  }
};

exports.getBookmarkedRecipes = async (req, res) => {
  const userId = req.user.id;

  try {
    const bookmarks = await Bookmark.findAll({
      where: { userId },
      attributes: ["recipeId"],
    });

    const recipeIds = bookmarks.map((bookmark) => bookmark.recipeId);

    const recipes = await Recipe.findAll({
      where: { id: { [Op.in]: recipeIds } },
      attributes: [
        "id",
        "name",
        "duration",
        "description",
        "ingredients",
        "photoUrl",
        "instructions",
      ],
    });

    const bookmarkedRecipeIds = bookmarks.map((bookmark) => bookmark.recipeId);

    const transformedRecipes = await Promise.all(
      recipes.map(async (recipe) => {
        let ingredientsArray = [];
        let instructionsArray = [];

        try {
          let ingredients = recipe.ingredients.trim();
          if (ingredients.startsWith("[") && ingredients.endsWith("]")) {
            ingredientsArray = JSON.parse(ingredients.replace(/'/g, '"'));
          } else {
            console.error(
              `Ingredients format is invalid for recipe ${recipe.id}`
            );
          }
        } catch (e) {
          console.error(
            `Error parsing ingredients for recipe ${recipe.id}:`,
            e
          );
        }

        try {
          let instructions = recipe.instructions.trim();
          if (instructions.startsWith("[") && instructions.endsWith("]")) {
            instructionsArray = JSON.parse(instructions.replace(/'/g, '"'));
          } else {
            console.error(
              `Instructions format is invalid for recipe ${recipe.id}`
            );
          }
        } catch (e) {
          console.error(
            `Error parsing instructions for recipe ${recipe.id}:`,
            e
          );
        }

        const isBookmarked = bookmarkedRecipeIds.includes(recipe.id);

        return {
          id: recipe.id,
          name: recipe.name,
          duration: recipe.duration,
          description: recipe.description,
          ingredients: ingredientsArray,
          isBookmarked: isBookmarked,
          photoUrl: recipe.photoUrl,
          instructions: instructionsArray,
        };
      })
    );

    res.status(200).json({
      error: false,
      message: "Successfully fetched bookmarked recipes",
      bookmarkedRecipes: transformedRecipes,
    });
  } catch (error) {
    console.error("Error fetching bookmarked recipes:", error);
    res.status(500).json({
      error: true,
      message: "An error occurred while fetching bookmarked recipes",
    });
  }
};

exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      limit: 1,
      attributes: [
        "id",
        "name",
        "duration",
        "description",
        "ingredients",
        "photoUrl",
        "instructions",
      ],
    });

    const recommendedRecipes = recipes.map((recipe) => {
      let ingredientsArray = [];
      let instructionsArray = [];

      try {
        let ingredients = recipe.ingredients.trim();
        if (ingredients.startsWith("[") && ingredients.endsWith("]")) {
          ingredientsArray = JSON.parse(ingredients.replace(/'/g, '"'));
        } else {
          console.error(
            `Ingredients format is invalid for recipe ${recipe.id}`
          );
        }
      } catch (e) {
        console.error(`Error parsing ingredients for recipe ${recipe.id}:`, e);
      }

      try {
        let instructions = recipe.instructions.trim();
        if (instructions.startsWith("[") && instructions.endsWith("]")) {
          instructionsArray = JSON.parse(instructions.replace(/'/g, '"'));
        } else {
          console.error(
            `Instructions format is invalid for recipe ${recipe.id}`
          );
        }
      } catch (e) {
        console.error(`Error parsing instructions for recipe ${recipe.id}:`, e);
      }

      return {
        id: recipe.id,
        name: recipe.name,
        duration: recipe.duration,
        description: recipe.description,
        ingredients: ingredientsArray,
        photoUrl: recipe.photoUrl,
        instructions: instructionsArray,
      };
    });

    res.status(200).json({
      error: false,
      message: "Successfully fetched recommended recipes",
      recommendedRecipes,
    });
  } catch (error) {
    console.error("Error fetching recommended recipes:", error);
    res.status(500).json({
      error: true,
      message: "Failed to fetch recommended recipes",
    });
  }
};

const isRecipeBookmarked = async (userId, recipeId) => {
  try {
    const bookmark = await Bookmark.findOne({
      where: {
        userId: userId,
        recipeId: recipeId,
      },
    });
    return bookmark !== null;
  } catch (error) {
    console.error("Error checking if recipe is bookmarked:", error);
    throw error;
  }
};

const findRecipesByName = async (recipeNames) => {
  const placeholders = recipeNames.map(() => "?").join(",");
  try {
    const rows = await Recipe.findAll({
      where: {
        name: {
          [Op.in]: recipeNames,
        },
      },
    });
    return rows;
  } catch (error) {
    console.error("Error fetching recipes by name:", error);
    throw error;
  }
};

const calculateMissingIngredients = (recipeIngredients, clientIngredients) => {
  return recipeIngredients.filter(
    (ingredient) => !clientIngredients.includes(ingredient)
  );
};

const fetchRecommendedRecipes = async (user_input) => {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const response = await fetch(
        "https://recommendation-system-api-ehx2oeustq-et.a.run.app/recommend",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_input }),
          timeout: 10000,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === "AbortError" || error.name === "FetchError") {
        attempt++;
        if (attempt === maxRetries) {
          throw new Error(
            "Maximum retry attempts reached. Unable to fetch recommended recipes."
          );
        }
      } else {
        throw error;
      }
    }
  }
};

const transformRecipe = async (recipe, clientIngredients, userId) => {
  let recipeIngredients = [];
  let instructionsArray = [];

  try {
    let ingredients = recipe.ingredients.trim();
    if (ingredients.startsWith("[") && ingredients.endsWith("]")) {
      recipeIngredients = JSON.parse(ingredients.replace(/'/g, '"'));
    } else {
      console.error(`Ingredients format is invalid for recipe ${recipe.id}`);
    }
  } catch (e) {
    console.error(`Error parsing ingredients for recipe ${recipe.id}:`, e);
  }

  try {
    let instructions = recipe.instructions.trim();
    if (instructions.startsWith("[") && instructions.endsWith("]")) {
      instructionsArray = JSON.parse(instructions.replace(/'/g, '"'));
    } else {
      console.error(`Instructions format is invalid for recipe ${recipe.id}`);
    }
  } catch (e) {
    console.error(`Error parsing instructions for recipe ${recipe.id}:`, e);
  }

  const missingIngredients = calculateMissingIngredients(
    recipeIngredients,
    clientIngredients
  );
  const isBookmarked = await isRecipeBookmarked(userId, recipe.id);

  return {
    id: recipe.id,
    name: recipe.name,
    duration: recipe.duration,
    description: recipe.description,
    ingredients: clientIngredients,
    missingIngredients: missingIngredients,
    isBookmarked: isBookmarked,
    photoUrl: recipe.photoUrl,
    instructions: instructionsArray,
  };
};

exports.getScannedRecipes = async (req, res) => {
  const ingredientList = req.body.ingredientList;
  const userId = req.user.id;

  if (!userId) {
    return res.status(404).json({ error: true, message: "User not found" });
  }

  const user_input = ingredientList
    .map((ingredient) => ingredient.name)
    .join(", ");

  try {
    const responseData = await fetchRecommendedRecipes(user_input);

    if (!responseData.recommended_recipes) {
      throw new Error("Invalid response from external API");
    }

    let recommendedRecipes = responseData.recommended_recipes;

    if (recommendedRecipes.length > 20) {
      recommendedRecipes = recommendedRecipes.slice(0, 20);
    }

    const recipes = await findRecipesByName(recommendedRecipes);

    const clientIngredients = ingredientList.map(
      (ingredient) => ingredient.name
    );

    const transformedRecipes = await Promise.all(
      recipes.map((recipe) =>
        transformRecipe(recipe, clientIngredients, userId)
      )
    );

    res.json({
      error: false,
      message: "Succesfully retrieved the recipes",
      recommendedRecipes: transformedRecipes,
    });
  } catch (error) {
    console.error("Error fetching recommended recipes:", error);
    res
      .status(500)
      .json({ error: true, message: "Error fetching recommended recipes" });
  }
};

exports.getRecipesTest = async (req, res) => {
  const ingredientList = req.body.ingredientList;
  const user_input = ingredientList
    .map((ingredient) => ingredient.name)
    .join(", ");

  try {
    const responseData = await fetchRecommendedRecipes(user_input);

    if (!responseData.recommended_recipes) {
      throw new Error("Invalid response from external API");
    }

    let recommendedRecipes = responseData.recommended_recipes;

    res.json({
      error: false,
      message: "Succesfully retrieved the recipes",
      recommendedRecipes: recommendedRecipes,
    });
  } catch (error) {
    console.error("Error fetching recommended recipes:", error);
    res
      .status(500)
      .json({ error: true, message: "Error fetching recommended recipes" });
  }
};

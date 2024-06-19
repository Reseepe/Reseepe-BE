# User API Spec

## Register User API

Endpoint : POST /api/register

Request Body :

```json
{
  "name": "name",
  "email": "example@gmail.com",
  "birthday": "YYYY-MM-DD",
  "password": "secret"
}
```

Response Body Success :

```json
{
  "error": false,
  "message": "User Creted"
}
```

## Login User API

Endpoint : POST /api/login

Request Body :

```json
{
  "email": "example@gmail.com",
  "password": "secret"
}
```

Response Body Success :

```json
{
  "error": false,
  "message": "success",
  "loginResult": {
    "userId": "unique-id",
    "name": "name",
    "token": "unique-token"
  }
}
```

## Get User API

Endpoint : GET /api/profile

Request Header :

- Authorization: Bearer <token>

Response Body Success :

```json
{
  "error": false,
  "message": "User fetched succesfully",
  "user": {
    "userId": "unique-id",
    "name": "name",
    "email": "example@gmail.com"
  }
}
```

## Update User API

Endpoint : PUT /api/profile/edit

Request Body :

```json
{
  "name": "name",
  "email": "example@gmail.com",
  "birthday": "YYYY-MM-DDDD"
}
```

Response Body Success :

```json
{
  "error": false,
  "message": "Succesfully update user data"
}
```

## Change User Password API

Endpoint : POST /api/changespass

Request Header :

- Authorization: Bearer <token>

Request Body:

```json
{
  "oldPassword": "abcdefgh",
  "newPassword": "hgfedcba"
}
```

Response Body Success :

```json
{
  "error": false,
  "message": "Succesfully update the password"
}
```

# Recipes API Spec

## Get 5 Recommended Recipe

Endpoint : GET /api/recommended

Request Header :

- Authorization: Bearer <token>

Response Body Success :

```json
{
    "error": false,
    "message": "Succesfully bookmarked the recipe",
    "recommendedList": [
        {
        "id": "1",
        "name": "Indonesian Fried Rice",
        "duration": 60,
        "description": "Indoensian fried rice, known as Nasi Goreng, is a ...",
        "ingredients": [
            "rice",
            "garlic",
            "shallot"
        ],
        "isBookmarked": true,
        "photoUrl": "image-url",
        "instruction": [
            "instruction1",
            "instruction2",
            "instruction3"
        ]
        }
    ]
}
```

## Add Bookmark API

Endpoint : POST /api/bookmark/{recipeId}

Request Header :

- Authorization: Bearer <token>

Input Parameter :

- recipeId (UUID)

Response Body Success :

```json
{
  "error": false,
  "message": "Succesfully bookmarked the recipe"
}
```

## Get Bookmark API

Endpoint : GET /api/bookmarked

Request Header :

- Authorization: Bearer <token>

Response Body Success :

```json
{
    "error": false,
    "message": "Succesfully bookmarked the recipe",
    "bookmarkedRecipes": [
        {
            "id": "1",
            "name": "Indonesian Fried Rice",
            "duration": 60,
            "description": "Indoensian fried rice, known as Nasi Goreng, is a ...",
            "ingredients": [
                "rice",
                "garlic",
                "shallot"
            ],
            "isBookmarked": true,
            "photoUrl": "image-url",
            "instruction": [
                "instruction1",
                "instruction2",
                "instruction3"
            ]
        }
    ]
}
```

## Get Ingredient from Scanned Photo API

Endpoint : POST /api/ingredient

Request Header :

- Content-Type: multipart/form-data

Request Body :

- Photo (File)

Response Body Success :

```json
{
  "error": false,
  "message": "Ingredients fetcehd succesfully",
  "ingredientList": [
    {
      "name": "white onion"
    },
    {
      "name": "water spinach"
    }
  ]
}
```

## Get Recipes with Scanned Ingredients

Endpoint : POST /api/recipes

Request Header :

- Authorization: Bearer <token>

Request Body :

```json
{
  "error": false,
  "message": "Succesfully scanned the ingredients",
  "ingredientList": [
    {
      "name": "white onion"
    },
    {
      "name": "water spinach"
    }
  ]
}
```

Response Body Success :

```json
{
  "error": false,
  "message": "Succesfully bookmarked the recipe",
  "recommendedRecipes": [
    {
      "id": 1,
      "name": "red pepper asiago gougere  cheese bites",
      "duration": 95,
      "description": "these are cheesy and savory puff pastry bites. recipe from land o lakes.",
      "ingredients": [
        "water",
        "butter",
        "all-purpose flour",
        "garlic salt",
        "eggs",
        "asiago cheese",
        "red bell pepper",
        "fresh basil"
      ],
      "missingIngredients": [
        "chicken", 
        "tomato"
      ],
      "isBookmarked": true,
      "photoUrl": null,
      "instructions": [
            "instruction1",
            "instruction2",
            "instruction3"
      ]
    }
  ]
}
```

## Search Ingredient API

Endpoint : GET /api/search?q=<query>

Query Parameter :

- ingredient name (UUID)

Response Body Success :

```json
{
  "error": false,
  "message": "Succesfully bookmarked the recipe",
  "found": 2,
  "ingredientList": [
    {
      "name": "white onion"
    },
    {
      "name": "red onion"
    }
  ]
}
```

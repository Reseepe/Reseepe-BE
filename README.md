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
        "recipeId": "unique-id (UUID)",
        "name": "Indonesian Fried Rice",
        "description": "Indoensian fried rice, known as Nasi Goreng, is a ...",
        "ingredientList": [
            {
                "name": "rice",
                "description": "100 grams of cooked rice"
            }
        ],
        "photoUrl": "image-url",
        "instruction": "prep: chop"
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
    ```json
{
    "error": false,
    "message": "Succesfully bookmarked the recipe",
    "bookmarkedRecipes": [
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
                "heat oven to 400 degrees f",
            ]
        }
    ]
}
```
}
```


## Get Ingredient from Scanned Photo API

Endpoint : POST /api/ingredient

Request Header :
- Authorization: Bearer <token>
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
            "name": "white onion",
        },
        {
            "name": "water spinach",
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
    "ingredientList": [
        {
            "name": "white onion",
        },
        {
            "name": "water spinach",
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
                "heat oven to 400 degrees f",
                "line baking sheet with parchment paper",
                "set aside",
                "place water and butter in heavy 2-quart saucepan",
                "cook over medium heat until mixture comes to a full boil",
                "reduce heat to low",
                "stir in flour and garlic salt vigorously until mixture leaves sides of pan and forms a ball",
                "remove from heat",
                "add 1 egg at a time , beating well after each addition , until mixture is smooth",
                "stir in 1 cup cheese , bell pepper and basil",
                "immediately drop by rounded teaspoonfuls onto prepared baking sheets",
                "sprinkle each with 1 / 4 t remaining cheese",
                "bake for 20-22 minutes or until golden brown",
                "serve warm"
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
            "name": "white onion",
        },
        {
            "name": "red onion",
        }
    ]
}
```

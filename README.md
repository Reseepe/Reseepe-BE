# User API Spec

![WhatsApp Image 2024-06-04 at 11 35 26_79bbf5bf](https://github.com/Reseepe/Reseepe-BE/assets/96192431/7cb25b2a-f5e1-4176-be22-45bc0f5c1c94)

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
        "ingridientList": [
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
    "recipeList": [
        {
        "recipeId": "unique-id (UUID)",
        "name": "Indonesian Fried Rice",
        "description": "Indoensian fried rice, known as Nasi Goreng, is a ...",
        "ingridientList": [
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


## Get Ingridient from Scanned Photo API

Endpoint : POST /api/ingridient

Request Header :
- Authorization: Bearer <token>
- Content-Type: multipart/form-data

Request Body :
- Photo (File)

Response Body Success :
```json
{
    "error": false,
    "message": "Ingridients fetcehd succesfully",
    "ingridientList": [
        {
            "name": "white onion",
        },
        {
            "name": "water spinach",
        }
    ]
}
```


## Get Recipes with Scanned Ingridients

Endpoint : POST /api/recipes

Request Header :
- Authorization: Bearer <token>

Request Body :
```json
{
    "ingridientList": [
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
    "recipeList": [
        {
        "recipeId": "unique-id (UUID)",
        "name": "Indonesian Fried Rice",
        "description": "Indoensian fried rice, known as Nasi Goreng, is a ...",
        "ingridientList": [
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


## Search Ingridient API

Endpoint : GET /api/search?q=<query>

Query Parameter :
- ingridient name (UUID)

Response Body Success :
```json
{
    "error": false,
    "message": "Succesfully bookmarked the recipe",
    "found": 2,
    "ingridientList": [
        {
            "name": "white onion",
        },
        {
            "name": "red onion",
        }
    ]
}
```

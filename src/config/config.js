require('dotenv').config();

module.exports ={
  "development": {
    "username": "root",
    "password": "admin",
    "database": "reseepe",
    "host": "127.0.0.1",
    "dialect": "mysql",
    jwtSecret: "secret-key",
    jwtExpiration: 3600,
  },
  "test": {
    "username": "root",
    "password": "admin",
    "database": "reseepe",
    "host": "127.0.0.1",
    "dialect": "mysql",
    jwtSecret: "secret-key",
    jwtExpiration: 3600,
  },
  "production": {
    "username": "root",
    "password": "admin",
    "database": "reseepe",
    "host": "127.0.0.1",
    "dialect": "mysql",
    jwtSecret: "secret-key",
    jwtExpiration: 3600,
  },
}
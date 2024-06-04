const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpiration } = require("../config/config").development;

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, jwtSecret, {
    expiresIn: jwtExpiration,
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
};

module.exports = { generateToken, verifyToken };

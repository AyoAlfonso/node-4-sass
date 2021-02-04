const jwt = require("jsonwebtoken");
const env = require("dotenv");
const jwtSecret = '#@%$408324801-3'

const isDevelopment = process.env.NODE_ENV === "development";

module.exports.generate = (payload) => jwt.sign(payload, jwtSecret);

module.exports.decode = (token) => {
  try {
    const decoded = jwt.verify(token, jwtSecret);
    return decoded;
  } catch (error) {
    if (isDevelopment) console.error(error);
    return false;
  }
};


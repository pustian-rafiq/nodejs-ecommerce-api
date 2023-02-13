const jwt = require("jsonwebtoken");

const generateJWTToken = ({ _id, firstName, lastName, email, role }) => {
  return jwt.sign(
    { _id, firstName, lastName, email, role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

const generateRefreshToken = ({ _id, firstName, lastName, email, role }) => {
  return jwt.sign(
    { _id, firstName, lastName, email, role },
    process.env.JWT_SECRET,
    { expiresIn: "3d" }
  );
};

module.exports = { generateJWTToken, generateRefreshToken };

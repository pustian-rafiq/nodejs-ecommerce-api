const jwt = require("jsonwebtoken");

const generateJWTToken = ({ id, firstName, lastName, email, role }) => {
  console.log("jwt", id);
  return jwt.sign(
    { id, firstName, lastName, email, role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

const generateRefreshToken = ({ id, firstName, lastName, email, role }) => {
  return jwt.sign(
    { id, firstName, lastName, email, role },
    process.env.JWT_SECRET,
    { expiresIn: "3d" }
  );
};

module.exports = { generateJWTToken, generateRefreshToken };

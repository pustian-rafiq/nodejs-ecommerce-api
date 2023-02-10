const jwt = require("jsonwebtoken");

const generateJWTToken = ({ _id, firstName, lastName, email, role }) => {
  return jwt.sign(
    { firstName, lastName, email, role },
    process.env.JWT_SECRET,
    {
      expiresIn: "10d",
    }
  );
};

module.exports = { generateJWTToken };

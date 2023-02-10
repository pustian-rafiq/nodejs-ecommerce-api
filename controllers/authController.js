const User = require("../models/user");

// Register a new user
const register = async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email });

  if (!findUser) {
    try {
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  } else {
    return res.status(400).json({ error: "User already exists" });
  }
};

module.exports = { register };

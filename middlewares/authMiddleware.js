const User = require("../models/user");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// This is a middleware function that will check if the user is logged in.
//  Then it will send logged user details to that route.

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // console.log("req.params.id", req.params.id);
    // console.log("decode", decode);
    // try {
    //     token = req.headers.authorization.split(" ")[1];
    //     const decode = jwt.verify(token, process.env.JWT_SECRET);
    //     const user = await User.findById(decode?._id);

    //   if (decode?._id === req.params.id) {
    //     console.log("Auth", user);
    //     req.user = user;
    //     next();
    //   } else {
    //     throw new Error("You are not authorized. Please log in.");
    //   }
    // } catch (err) {
    //   throw new Error("You are not authorized. Please log in.");
    // }
    token = req.headers.authorization.split(" ")[1];

    if (!token) {
      throw new Error("You are not authorized. Please log in.");
    }

    // ekhane only token ace kina test kora hoice but token valid kina test kora hoini
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        throw new Error("You are not authorized. Please log in.");
      }
      req.user = user;
      next();
    });
  } else {
    throw new Error(" There is no token attached to header");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  try {
    const adminUser = await User.findOne({ email });
    if (adminUser?.role != "admin") {
      throw new Error("You are not an Admin");
    } else {
      next();
    }
  } catch (err) {
    throw new Error(err);
  }
});

const verifyToken = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return next(createError(401, "You are not authenticated"));
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return next(createError(403, "Token is not valid!"));
      }
      req.user = user;
      next();
    });
  } else {
    throw new Error(" There is no token attached to header");
  }
};
module.exports = { authMiddleware, isAdmin, verifyToken };

// export const verifyToken = (req, res, next) => {
//     console.log(req);
//     console.log(req.headers["authorization"]);
//     const token = req.headers["authorization"];
//     // const token = req.cookies.access_token;
//     if (!token) {
//       return next(createError(401, "You are not authenticated"));
//     }

//     jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
//       if (err) {
//         return next(createError(403, "Token is not valid!"));
//       }
//       req.user = user;
//       next();
//     });
//   };
//   //Verify user
//   export const verifyUser = (req, res, next) => {
//     verifyToken(req, res, next, () => {
//       if (req.user.id === req.params.id || req.user.isAdmin) {
//         next();
//       } else {
//         return next(createError(403, "You are not authorized!"));
//       }
//     });
//   };

//   //Verify admin
//   export const verifyAdmin = (req, res, next) => {
//     verifyToken(req, res, next, () => {
//       if (req.user.isAdmin) {
//         next();
//       } else {
//         return next(createError(403, "You are not authorized!"));
//       }
//     });
//   };

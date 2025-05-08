const jwt = require("jsonwebtoken");
const { error } = require("./errors");

const jwtSecretKey = process.env.JWT_SECRET;
const jwtRefreshSecretKey = process.env.JWT_REFRESH_SECRET;

// generate a new token when first time log
const generateToken = (id, username) => {
  return jwt.sign({ id, username }, jwtSecretKey, { expiresIn: "1d" });
};

// generate a token when previous token expires

const generateRefreshToken = (id, username) => {
  return jwt.sign({ id, username }, jwtRefreshSecretKey, { expiresIn: "3d" });
};

// verify if a token exist or valide
const verifyToken = (req, res, next) => {
  const auth =
    req.headers.authorization.includes("Bearer") ||
    req.headers.Authorization.includes("Bearer");


  if (auth) {
    const token = req.headers.authorization.split(" ")[1] ||
                   req.headers.Authorization.split(" ")[1]

    jwt.verify(token, jwtSecretKey, (err, user) => {
      if (err) {
        return next(error(403, "token is not valid"));
      }

      req.user = user;
      next();
    });
  } else {
    next(error(401, "your not authenticated"));
  }
};

const verifyRefreshToken = (req, res, next) => {
  const auth = req.cookies.refresh_access_token;


  if (auth) {
    const token = auth;
    jwt.verify(token, jwtRefreshSecretKey, (err, user) => {
      if (err) {
        return next(error(403, "token is not valid"));
      }
      req.user = user;
      next();
    });
  } else {
    next(error(401, "your not authenticated"));
  }
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
};

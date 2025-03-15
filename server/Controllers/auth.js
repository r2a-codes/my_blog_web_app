const cryptoJs = require("crypto-js");
const { error } = require("../Middlewares/errors");
const { generateToken, generateRefreshToken } = require("../Middlewares/jwt");
const User = require("../Models/UserSchema");

cookieSecretKey = process.env.COOKIE_SECRET_KEY;

//* Register a User is Complete
const register = async (req, res, next) => {
  const { username, email, pass } = req.body;

  try {
    const userAlreadyExist = await User.findOne({ email });
    if (userAlreadyExist) {
      return next(
        error(
          401,
          "sorry this email is already used try with another one or try to connect "
        )
      );
    }

    if (!pass.trim()) {
      return next(error(401, "Please fill all field"));
    } else if (pass.length < 8) {
      return next(error(401, "password must have 8 or more characters "));
    }

    const hashedPass = cryptoJs.AES.encrypt(
      pass,
      process.env.CRYPTO_JS_SECRET
    ).toString();

    await User.create({
      email,
      username,
      password: hashedPass,
    });

    res.status(201).json("Register with success");
  } catch (err) {
    next(err);
  }
};

//* Login a User is Complete
const login = async (req, res, next) => {
  const { email, pass } = req.body;
  try {
    if (!email.trim() || !pass.trim())
      return next(error(400, "please fill all field"));

    const user = await User.findOne({ email }).select([
      "username",
      "profile",
      "password",
    ]);

    if (!user) return next(error(404, "user not found"));

    const decryptedPass = cryptoJs.AES.decrypt(
      user.password,
      process.env.CRYPTO_JS_SECRET
    ).toString(cryptoJs.enc.Utf8);

    matchingPass = decryptedPass === pass.trim();

    if (!matchingPass) return next(error(401, "wrong credentials"));

    const token = generateToken(user._id, user.username);
    const refreshToken = generateRefreshToken(user._id, user.username);

    const { password, ...userInfo } = user._doc;

    res
      .cookie("refresh_access_token", refreshToken, {
        maxAge:  7 *24 * 60 * 60 * 1000,
        httpOnly: true,
        // secure: true,
        // sameSite: "None"
      })
      .status(200)
      .json({ userInfo, token });
  } catch (err) {
    next(err);
  }
};

//* Logout a User is Complete
const logout = async (req, res, next) => {
  try {
    res
      .clearCookie("refresh_access_token", {
        httpOnly: true,
        // secure:true,
        // sameSite:"None",
      })
      .status(204)
      .json("logout with success");
  } catch (err) {
    next(err);
  }
};

//* Refresh  User Token is Complete
const refresh = async (req, res, next) => {
  const auth = req.cookies.refresh_access_token;

  if(!auth) return next(error(403 , "not authorized !!"))

  const id = req.user.id;

  try {
    const userInfo = await User.findById(id, ["username", "profile"]);

    if (!userInfo) {
      return next(error(401, "user don't exist"));
    }
    const token = generateToken(userInfo._id, userInfo.username);
    res.status(200).json({ userInfo, token });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, register, logout, refresh };

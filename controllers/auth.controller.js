const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and Password are required." });
  // check for duplicate usernames in database
  const duplicate = await User.findOne({ username: username }).exec();
  if (duplicate) return res.sendStatus(409); // Conflict
  try {
    // Encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);
    // Store the new user
    const result = await User.create({ username, password });
    console.log(result);
    res.status(201).json({ success: `New user ${username} created.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and Password are required." });

  const foundUser = await User.findOne({ username: username }).exec();
  if (!foundUser) return res.sendStatus(401); // Unauthorized
  // Evaluate password
  const match = foundUser.comparePassword(password);
  if (match) {
    // Create JWTs
    const accessToken = foundUser.generateJWT("14m");
    const refreshToken = foundUser.generateJWT("1d");

    // Creates Secure Cookie with refresh token
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      // secure: true, // Commented out so api can be tested against postman. enable in production
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Send Access Token to client
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};

exports.refresh = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refresh_token) return res.sendStatus(401);
  const refreshToken = cookies.refresh_token;

  jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (err, decoded) => {
    const foundUser = await User.findById(decoded.id).exec();
    if (!foundUser || err) return res.sendStatus(403); // Forbidden

    const accessToken = foundUser.generateJWT("14m");
    res.json({ accessToken });
  });
};

exports.logout = async (req, res) => {
  // On client, also delete the access token
  const cookies = req.cookies;
  if (!cookies?.refresh_token) return res.sendStatus(204); // No content

  res.clearCookie("refresh_token", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.sendStatus(204);
};

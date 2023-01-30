const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and Password are required." });

  const foundUser = await User.findOne({ username: username }).exec();
  if (!foundUser) return res.sendStatus(401); // Unauthorized
  // Evaluate password
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    // Create JWTs
    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "300s" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    // Saving refreshToken with current user
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result);

    // Creates Secure Cookie with refresh token
    res.cookie("jwt", refreshToken, {
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

module.exports = { handleLogin };

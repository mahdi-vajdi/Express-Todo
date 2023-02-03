const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: String,
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  // Encrypt the password
  try {
    const hashedPwd = await bcrypt.hash(user.password, 10);
    user.password = hashedPwd;
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateJWT = function (expiry) {
  let payload = {
    id: this._id,
    username: this.username,
  };

  return jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: expiry,
  });
};

module.exports = mongoose.model("User", userSchema);

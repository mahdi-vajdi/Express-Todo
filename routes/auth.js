const express = require("express");
const router = express.Router();
const registerContorller = require("../controller/registerController");
const loginController = require("../controller/loginController");
const refreshTokenController = require("../controller/refreshTokenController");
const logoutController = require("../controller/logoutController");

router.post("/register", registerContorller.handleNewUser);

router.post("/login", loginController.handleLogin);

router.get("/refresh", refreshTokenController.handleRefreshToken);

router.get("/logout", logoutController.handleLogout);

module.exports = router;

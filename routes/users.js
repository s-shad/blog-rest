const { Router } = require("express");

const userController = require("../controllers/userController");
const { authenticated } = require("../middlewares/auth");

const router = new Router();

//  @desc   Login Handle
//  @route  POST /users/login
router.post("/login", userController.handleLogin, userController.rememberMe);

//  @desc   Logout Handle
//  @route  GET /users/logout
router.get("/logout", authenticated, userController.logout);

//  @desc   Reset Password Page
//  @route  GET /users/reset-password/:token
router.post("/reset-password/:token", authenticated, userController.resetPassword);

//  @desc   Handle Forget Password
//  @route  POST /users/forget-password,
router.post("/forget-password", userController.handleForgetPassword);

//  @desc   Register Handle
//  @route  POST /users/register
router.post("/register", userController.createUser);

module.exports = router;

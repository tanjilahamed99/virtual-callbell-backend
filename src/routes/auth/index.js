const checkUser = require("../../api/v1/auth/checkUser");
const login = require("../../api/v1/auth/login");
const register = require("../../api/v1/auth/register");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/check-user", checkUser);

module.exports = router;

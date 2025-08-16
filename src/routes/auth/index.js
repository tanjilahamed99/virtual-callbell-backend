const register = require("../../api/v1/auth/register");

const router = require("express").Router();

// // GET
// router.get("/validate", validate);

// // POST
// router.post("/authorize-user", authorizeUser);
router.post("/register", register);
// router.post("/send-otp", sendOTP);
// router.post("/verify-otp", verifyOTP);
// router.post("/change-password", changePassword);
// router.put("/updateInfo", updateInfo);

module.exports = router;

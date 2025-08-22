const getMyData = require("../../api/v1/users/getMyData");
const getUserData = require("../../api/v1/users/getUser");
const getWebsiteData = require("../../api/v1/users/getWebsiteData");
const updateUserData = require("../../api/v1/users/updateUserData");

const router = require("express").Router();

router.put("/update/:userId", updateUserData);
router.get("/myData/:userId", getMyData);
router.get("/get/:userId", getUserData);
router.get("/website", getWebsiteData);

module.exports = router;

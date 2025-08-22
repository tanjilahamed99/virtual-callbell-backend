const addWebsiteData = require("../../api/v1/admin/addWebisteData");
const deleteUser = require("../../api/v1/admin/deleteUser");
const getAllUsers = require("../../api/v1/admin/getAllUsers");
const checkAdmin = require("../../middlewares/checkAdmin");

const router = require("express").Router();


router.get("/users/:id/:email", checkAdmin, getAllUsers);
router.delete("/user/delete/:id/:email/:userId", checkAdmin, deleteUser);

// website data related
router.post("/website/add/:id/:email", checkAdmin, addWebsiteData);

module.exports = router;

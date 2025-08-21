const deleteUser = require("../../api/v1/admin/deleteUser");
const getAllUsers = require("../../api/v1/admin/getAllUsers");
const checkAdmin = require("../../middlewares/checkAdmin");

const router = require("express").Router();

// router.get("/history/:id/:email");
// router.get("/subscriptions/:id/:email");
router.get("/users/:id/:email", checkAdmin, getAllUsers);
router.delete("/user/delete/:id/:email/:userId", checkAdmin, deleteUser);

module.exports = router;

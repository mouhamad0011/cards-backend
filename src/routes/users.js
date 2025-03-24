const express = require("express");
const router = express.Router();
const {
 getAll,
 login,
 register,
 deleteUser
} = require("../controllers/users");

router.get("/getAll", getAll);
router.post("/login", login);
router.post("/register", register);
router.delete("/delete/:id", deleteUser);


module.exports = router;
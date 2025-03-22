const express = require("express");
const router = express.Router();
const {
 getAll,
 login,
 register
} = require("../controllers/users");

router.get("/getAll", getAll);
router.post("/login", login);
router.post("/register", register);

module.exports = router;
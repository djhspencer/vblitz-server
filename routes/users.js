const express = require("express");
const router = express.Router();

const users = require("../controllers/user.controller.js");

// Auth routes
router.post("/register", users.register);

router.post("/login", users.login);

router.get("/logout", users.logout);

router.get("/refresh", users.refresh);


//basic routes
router.post("/create", users.createUser);

router.patch("/update/:id", users.updateUser);

router.delete("/delete/:id", users.deleteUser);



module.exports = router;

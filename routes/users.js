const express = require("express");
const router = express.Router();

const users = require("../controllers/user.controller.js");

// Create a new user
router.post("/", users.createUser);

// router.get('/', (request, response) => {
//   response.json({ info: 'Node.js, Express, and Postgres API' })
// })


module.exports = router;

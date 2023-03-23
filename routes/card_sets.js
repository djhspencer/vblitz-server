const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const card_sets = require("../controllers/card_set.controller.js");

//basic routes
router.post("/create", authorizeUser, card_sets.createCardSet);

router.get("/getCardSets", authorizeUser, card_sets.getCardSets);

//router.patch("/update/:id", folders.updateFolder);

//router.delete("/delete/:id", folders.deleteFolder);

async function authorizeUser(req, res, next) {

  const authHeader = req.headers.authorization || req.headers.Authorization;
  console.log(authHeader);

  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const accessToken = authHeader.split(" ")[1];
  console.log(accessToken);

  try {
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "invalid token" }); //invalid token
      console.log(decoded.UserInfo.userId);
      res.userId = decoded.UserInfo.userId;
      next()
    });
  } catch (err) {
    console.log("Error");
    res.status(500).json({ message: err.message });
  }
}



module.exports = router;

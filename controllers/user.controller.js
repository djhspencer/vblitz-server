const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.createUser = async (req, res) => {
  // Validate request
  if (!req.body.first_name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Tutorial
  const user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email
  };
  console.log(user);
  //console.log(db);

  try {
    console.log(user);
    const newUser = await User.create(user)
    res.status(201).send(newUser)
  } catch (err) {
    console.error(err);
    res.status(500).send(err)
  }

};
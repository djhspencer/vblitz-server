require("dotenv").config();
const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.register = async (req, res) => {
  if (req.body.email == null || req.body.email == null || req.body.pass == null) {
    return res.status(400).json({ message: "Username and password required." });
  }
  try {
    const dup = await User.findOne({ where: { email: req.body.email } });
    if (!dup) {

      const hashedPassword = await bcrypt.hash(req.body.pass, 10);

      const refreshToken = jwt.sign(
        { email: req.body.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      const user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        pass: hashedPassword,
        refresh_token: refreshToken
      };

      const newUser = await User.create(user)
      console.log(newUser)

      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: user.email,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15s" }
      );

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ accessToken });

    } else {
      return res.status(409).json({ message: "Email already taken" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  if (req.body.email == null || req.body.pass == null) {
    return res.status(400).json({ message: "Username and password required." });
  }

  try {
    //check if there is a user with this email
    const user = await User.findOne({ where: { email: req.body.email } });
    if (user == null) {
      return res.status(404).json({ message: "Email is incorrect" });
    } 
    //check if this password is correct
    if (await bcrypt.compare(req.body.pass, user.pass)) {

      //create JWTS for access and refresh
      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: user.email,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15s" }
      );

      const refreshToken = jwt.sign(
        { email: user.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      await User.update({ refresh_token: refreshToken }, {
        where: { id: user.id}
      });

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ accessToken });

    } else {
      res.status(400).json({ message: "Wrong password buddy" });
    }
  } catch {
    res.status(400).json({ message: err.message });
  }
};

exports.refresh = async (req, res) => {
  console.log("REFRESHED");
  console.log(req.cookies);
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  const user = await User.findOne({ refresh_token: refreshToken });
  if (user == null) {
    return res.status(404).json({ message: "Not valid" });
  }

  try {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || user.email !== decoded.email)
          //invalid token or the content doesnt match
          return res.sendStatus(403);

        const accessToken = jwt.sign(
          {
            UserInfo: {
              email: decoded.email,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15s" }
        );

        res.status(200).json({ accessToken });
      }
    );
  } catch (err) {
    //console.log("errrrr");
    res.status(500).json({ message: err.message });
  }
};

exports.logout = async (req, res) => {

  console.log(req.cookies);
  console.log("LOGGIN OUT")
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;


  try {
    const user = await User.findOne({ where: { refresh_token: refreshToken } });
    if (user == null) {
      return res.status(404).json({ message: "Not valid" });
    }

    await User.update({ refresh_token: null }, {
      where: { id: user.id}
    });

    res.status(200).json({ message: "Successfully logged out" });
  } catch (err) {
    console.log("An Error has occurred");
    res.status(500).json({ message: err.message });
  }
};

// create new user
exports.createUser = async (req, res) => {
  // Validate request
  if (!req.body.first_name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email
  };

  try {
    //console.log(user);
    const newUser = await User.create(user)
    res.status(201).send(newUser)
  } catch (err) {
    console.error(err);
    res.status(500).send(err)
  }

};

exports.updateUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.update(req.body.stuff, {
      where: { id: id}
    })
    if (user == 1){
      res.status(200).send({ message: "User updated successfully"})
    } else {
      res.status(400).send({ message: "User not updated"})
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err)
  }

};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.destroy({
      where: { id: id}
    })
    if (user == 1){
      res.status(200).send({ message: "User deleted successfully"})
    } else {
      res.status(400).send({ message: "User not deleted"})
    }

  } catch (err) {
    console.error(err);
    res.status(500).send(err)
  }
};
require("dotenv").config();
const db = require("../models");
const User = db.users;
const Folder = db.folders;
const Op = db.Sequelize.Op;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createFolder = async (req, res) => {

  // Validate request
  if (!req.body.folder_name) {
    return res.status(400).send({
      message: "Folder needs a name"
    });
  }

  const folder = {
    folder_name: req.body.folder_name,
    creator_id: res.userId
  };

  try {
    //console.log(user);
    const newFolder = await Folder.create(folder)
    res.status(201).send(newFolder)
  } catch (err) {
    console.error(err);
    res.status(500).send(err)
  }

};

exports.getFolders = async (req, res) => {

  const userId = res.userId;

  try {
    //console.log(user);
    const folders = await Folder.findAll({ where: { creator_id: userId}})
    res.status(201).send(folders)
  } catch (err) {
    console.error(err);
    res.status(500).send(err)
  }

};


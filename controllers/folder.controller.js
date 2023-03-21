require("dotenv").config();
const db = require("../models");
const User = db.users;
const Folder = db.folders;
const Op = db.Sequelize.Op;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
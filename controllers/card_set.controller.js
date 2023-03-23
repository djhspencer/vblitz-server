require("dotenv").config();
const db = require("../models");
const User = db.users;
const Folder = db.folders;
const CardSet = db.card_sets;
const Card = db.cards;
const Op = db.Sequelize.Op;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createCardSet = async (req, res) => {

  console.log(req.body.cards)

  // Validate request
  if (!req.body.title) {
    return res.status(400).send({
      message: "Cards need text!"
    });
  }

  const card_set = {
    title: req.body.title,
    creator_id: res.userId
  };

  try {
    //console.log(user);
    const newCardSet = await CardSet.create(card_set)


    const cards = req.body.cards;
    for (let i = 0; i < cards.length; i++) {

      await Card.create({
        front: cards[i].frontText,
        back: cards[i].backText,
        creator_id: res.userId,
        card_index: i,
        card_set_id: newCardSet.id
      })

    }


    res.status(201).send(newCardSet)
  } catch (err) {
    console.error(err);
    res.status(500).send(err)
  }

};

exports.getCardSets = async (req, res) => {

  const userId = res.userId;

  try {
    //console.log(user);
    const card_sets = await CardSet.findAll({ where: { creator_id: userId}})
    res.status(201).send(card_sets)
  } catch (err) {
    console.error(err);
    res.status(500).send(err)
  }

};


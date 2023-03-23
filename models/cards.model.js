module.exports = (sequelize, Sequelize) => {
  const Card = sequelize.define("card", {
    front: {
      type: Sequelize.STRING
    },
    back: {
      type: Sequelize.STRING
    },
    creator_id: {
      type: Sequelize.INTEGER
    },
    card_set_id: {
      type: Sequelize.INTEGER
    },
    card_index: {
      type: Sequelize.INTEGER
    }

  });

  return Card;
};
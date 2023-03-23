module.exports = (sequelize, Sequelize) => {
  const CardSet = sequelize.define("card_set", {
    title: {
      type: Sequelize.STRING
    },
    creator_id: {
      type: Sequelize.INTEGER
    }

  });

  return CardSet;
};
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    first_name: {
      type: Sequelize.STRING
    },
    last_name: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    pass: {
      type: Sequelize.STRING
    },
    refresh_token: {
      type: Sequelize.STRING
    }
  });

  return User;
};
module.exports = (sequelize, Sequelize) => {
  const Folder = sequelize.define("folder", {
    folder_name: {
      type: Sequelize.STRING
    },
    creator_id: {
      type: Sequelize.INTEGER
    }

  });

  return Folder;
};
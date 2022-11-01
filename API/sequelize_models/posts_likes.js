const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('posts_likes', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'posts',
        key: 'id'
      }
    },
    like_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'likes',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'posts_likes',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "post_id",
        using: "BTREE",
        fields: [
          { name: "post_id" },
        ]
      },
      {
        name: "like_id",
        using: "BTREE",
        fields: [
          { name: "like_id" },
        ]
      },
    ]
  });
};

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('comments_likes', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    comment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'comments',
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
    tableName: 'comments_likes',
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
        name: "comment_id",
        using: "BTREE",
        fields: [
          { name: "comment_id" },
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

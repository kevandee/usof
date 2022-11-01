var DataTypes = require("sequelize").DataTypes;
var _categories = require("./categories");
var _comments = require("./comments");
var _comments_likes = require("./comments_likes");
var _likes = require("./likes");
var _posts = require("./posts");
var _posts_categories = require("./posts_categories");
var _posts_comments = require("./posts_comments");
var _posts_likes = require("./posts_likes");
var _users = require("./users");

function initModels(sequelize) {
  var categories = _categories(sequelize, DataTypes);
  var comments = _comments(sequelize, DataTypes);
  var comments_likes = _comments_likes(sequelize, DataTypes);
  var likes = _likes(sequelize, DataTypes);
  var posts = _posts(sequelize, DataTypes);
  var posts_categories = _posts_categories(sequelize, DataTypes);
  var posts_comments = _posts_comments(sequelize, DataTypes);
  var posts_likes = _posts_likes(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  posts_categories.belongsTo(categories, { as: "category", foreignKey: "category_id"});
  categories.hasMany(posts_categories, { as: "posts_categories", foreignKey: "category_id"});
  comments_likes.belongsTo(comments, { as: "comment", foreignKey: "comment_id"});
  comments.hasMany(comments_likes, { as: "comments_likes", foreignKey: "comment_id"});
  posts_comments.belongsTo(comments, { as: "comment", foreignKey: "comment_id"});
  comments.hasMany(posts_comments, { as: "posts_comments", foreignKey: "comment_id"});
  comments_likes.belongsTo(likes, { as: "like", foreignKey: "like_id"});
  likes.hasMany(comments_likes, { as: "comments_likes", foreignKey: "like_id"});
  posts_likes.belongsTo(likes, { as: "like", foreignKey: "like_id"});
  likes.hasMany(posts_likes, { as: "posts_likes", foreignKey: "like_id"});
  posts_categories.belongsTo(posts, { as: "post", foreignKey: "post_id"});
  posts.hasMany(posts_categories, { as: "posts_categories", foreignKey: "post_id"});
  posts_comments.belongsTo(posts, { as: "post", foreignKey: "post_id"});
  posts.hasMany(posts_comments, { as: "posts_comments", foreignKey: "post_id"});
  posts_likes.belongsTo(posts, { as: "post", foreignKey: "post_id"});
  posts.hasMany(posts_likes, { as: "posts_likes", foreignKey: "post_id"});
  comments.belongsTo(users, { as: "author", foreignKey: "author_id"});
  users.hasMany(comments, { as: "comments", foreignKey: "author_id"});
  likes.belongsTo(users, { as: "author", foreignKey: "author_id"});
  users.hasMany(likes, { as: "likes", foreignKey: "author_id"});
  posts.belongsTo(users, { as: "author", foreignKey: "author_id"});
  users.hasMany(posts, { as: "posts", foreignKey: "author_id"});

  return {
    categories,
    comments,
    comments_likes,
    likes,
    posts,
    posts_categories,
    posts_comments,
    posts_likes,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

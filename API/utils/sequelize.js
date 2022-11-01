const cfg = require('../config.json')
const { Sequelize, DataTypes } = require("sequelize");
const initModels = require('../sequelize_models/init-models');


const sequelize = new Sequelize(
    cfg.db.database,
    cfg.db.user,
    cfg.db.password,
    {
        host: cfg.db.host,
        dialect: 'mysql'
    }
);

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

const Resources = initModels(sequelize);

// Resources.users = users(sequelize, DataTypes);

// Resources.posts = posts(sequelize, DataTypes);

// Resources.categories = categories(sequelize, DataTypes);

// Resources.comments = comments(sequelize, DataTypes);

// Resources.likes = likes(sequelize, DataTypes);

// Resources.posts_categories = posts_categories(sequelize, DataTypes);

// Resources.posts_comments = posts_comments(sequelize, DataTypes);

// Resources.posts_likes = posts_likes(sequelize, DataTypes);

// Resources.comments_likes = comments_likes(sequelize, DataTypes);




// Resources.users.hasMany(Resources.posts, {
//     foreignKey: {
//         name: 'id'
//     }
// })

// Resources.posts.belongsTo()

sequelize.sync().then(() => {
    console.log('Book table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});


module.exports = {sequelize, Resources};
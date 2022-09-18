const cfg = require('../config.json')
const { Sequelize, DataTypes } = require("sequelize");

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

const Resources = {};

Resources.users = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    login: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(60),
        allowNull: false,
    },
    full_name: {
        type: DataTypes.STRING(60),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true,
    },
    role: {
        type: DataTypes.ENUM("admin", "user"),
        allowNull: false,
        defaultValue: "user",
    },
    profile_picture: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "profile_pictures/default.png",
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }
}, {
    timestamps: false
});

Resources.posts = sequelize.define('posts', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Resources.users,
            key: 'id',
        }
    },
    title: {
        type: DataTypes.STRING(256),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("active", "inactive"),
        allowNull: false,
        defaultValue: "active",
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    
}, {
    timestamps: false
});

Resources.categories = sequelize.define('categories', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING(64),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    
}, {
    timestamps: false
});

Resources.comments = sequelize.define('comments', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Resources.users,
            key: 'id'
        }
    },
    publish_date: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    
}, {
    timestamps: false
});

Resources.likes = sequelize.define('likes', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Resources.users,
            key: 'id'
        }
    },
    publish_date: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    type: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    
}, {
    timestamps: false
});

Resources.posts_categories = sequelize.define('posts_categories', {
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Resources.posts,
            key: 'id'
        }
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Resources.categories,
            key: 'id'
        }
    }
}, {
    timestamps: false
});

Resources.posts_comments = sequelize.define('posts_comments', {
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Resources.posts,
            key: 'id'
        }
    },
    comment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Resources.comments,
            key: 'id'
        }
    }
}, {
    timestamps: false
});

Resources.posts_likes = sequelize.define('posts_likes', {
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Resources.posts,
            key: 'id'
        }
    },
    like_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Resources.likes,
            key: 'id'
        }
    }
}, {
    timestamps: false
});

Resources.comments_likes = sequelize.define('comments_likes', {
    comment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Resources.posts,
            key: 'id'
        }
    },
    like_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Resources.categories,
            key: 'id'
        }
    }
}, {
    timestamps: false
});

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


module.exports = { sequelize, Resources};
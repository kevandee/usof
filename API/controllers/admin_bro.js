const AdminBro = require('admin-bro');
const AdminBroExpress = require('admin-bro-expressjs');
const AdminBroSequelize = require('admin-bro-sequelizejs');
const {sequelize, Resources} = require('../utils/sequelize')
const hashPassword = require('../utils/hashPassword')

AdminBro.registerAdapter(AdminBroSequelize)

const adminBro = new AdminBro ({
  Databases: [sequelize],
  rootPath: '/admin',
  resources: [
    {
        resource: Resources.users,
        options: {
            properties: {
                login: {
                  type: 'string',
                  isTitle: true  
                },
                password: {
                    type: 'string',
                    isVisible: {
                      list: true, edit: true, filter: false, show: true,
                    }
                },
                profile_picture: {
                    type: 'string',
                    isVisible: {
                      list: false, edit: true, filter: false, show: true,
                    }
                }
            },
            actions: {
                new: {
                    before: async(response) => {
                        let password = response.payload.password;
                        let login = response.payload.login;
                        if (!login || login.length < 5) {
                            throw new AdminBro.ValidationError({
                                name: {
                                    message: 'login length < 8',
                                },
                            },{
                                message: 'something wrong happened',
                            })
                        }
                        if(!password || password.length < 8) {
                            throw new AdminBro.ValidationError({
                                name: {
                                    message: 'password length < 8',
                                },
                            },{
                                message: 'something wrong happened',
                            })
                        }
                        response.payload.password = hashPassword(password);
                        console.log(response.payload.password)
                        return response
                    }
                }
            }
        }
    },
    Resources.posts,
    Resources.categories,
    Resources.comments,
    {
        resource: Resources.likes,
        options: {
            actions: {
                edit: {isVisible: false},
                delete: {isVisible: false}
            }
        }
    },
    {
        resource: Resources.posts_categories,
        options: {
            listProperties: ['post_id', 'category_id'],
            filterProperties: ['post_id', 'category_id'],
            editProperties: ['post_id', 'category_id'],
            showProperties: ['post_id', 'category_id'],
            actions: {
                edit: {isVisible: false},
                delete: {isVisible: false}
            }
        }
    },
    {
        resource: Resources.posts_comments,
        options: {
            listProperties: ['post_id', 'comment_id'],
            filterProperties: ['post_id', 'comment_id'],
            showProperties: ['post_id', 'comment_id'],
            actions: {
                edit: {isVisible: false},
                delete: {isVisible: false}
            }
        }
    },
    {
        resource: Resources.posts_likes,
        options: {
            listProperties: ['post_id', 'like_id'],
            filterProperties: ['post_id', 'like_id'],
            showProperties: ['post_id', 'like_id'],
            actions: {
                edit: {isVisible: false},
                delete: {isVisible: false}
            }
        }
    },
    {
        resource: Resources.comments_likes,
        options: {
            listProperties: ['comment_id', 'like_id'],
            filterProperties: ['comment_id', 'like_id'],
            showProperties: ['comment_id', 'like_id'],
            actions: {
                edit: {isVisible: false},
                delete: {isVisible: false}
            }
        }
    }
]
})


const adminRouter = AdminBroExpress.buildRouter (adminBro)

module.exports = { adminRouter, adminBro }
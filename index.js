const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const config = require('./config.json');
const {adminRouter, adminBro} = require('./controllers/admin_bro');
const authRouter = require('./routers/authorization');
const usersRouter = require('./routers/users');
const postsRouter = require('./routers/posts');
const categoriesRouter = require('./routers/categories');
const commentsRouter = require('./routers/comments');

const server = express();
const PORT = config.port || 3000;

server.use(express.json());
server.use(express.urlencoded({extended: true}));
server.use(cookieParser());
server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);
server.use('/api/posts', postsRouter);
server.use('/api/categories', categoriesRouter);
server.use('/api/comments', commentsRouter);
server.use(adminBro.options.rootPath, adminRouter);

server.use((req, res, next)=>{
  res.sendStatus(404);
});

server.listen(PORT, () => {
    console.log('Server started on port ' + PORT);
});

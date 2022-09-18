const jwt = require('jsonwebtoken');
const config = require('../config.json');

function generateAccessToken(obj) {
  return jwt.sign(obj, config.jwt.secret, { expiresIn: config.jwt.tokenLife });
}

function generateConfirmToken(obj) {
  return jwt.sign(obj, config.jwt.secret, { expiresIn: config.jwt.confirmTokenLife });
}

function authenticateToken(req, res, next) {
  let token = req.cookies.token;
  if (!token) 
    return res.sendStatus(401);
  
  jwt.verify(token, config.jwt.secret, (err, decoded) => {
    if (err) {
      res.sendStatus(401);
      return;
    };
    req.user = decoded;
    next();
  })
}

function authenticateTokenPublic(req, res, next) {
  let token = req.cookies.token;
  if (!token) {
    next();
    return
  }
  console.log("a");
  jwt.verify(token, config.jwt.secret, (err, decoded) => {
    if (err) {
      next();
      return
    };
    req.user = decoded;
    next();
  })
}

function authenticateConfirmToken(token) {
  if (!token) 
    return false;
  
  jwt.verify(token, config.jwt.secret, (err) => {
    if (err) {
      return false;
    };
  })

  return jwt.decode(token, config.jwt.secret, { expiresIn: config.jwt.confirmTokenLife });
}

module.exports = {generateAccessToken, generateConfirmToken, authenticateToken, authenticateTokenPublic, authenticateConfirmToken};
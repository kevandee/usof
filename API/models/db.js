const mysql = require('mysql2');
const config = require('../config.json');

const connect = () => {
  const connection = mysql.createConnection(config.db);
  connection.connect((err) => {
      if (err) {
        return console.error("Error: " + err.message);
      }
  });
  return connection;
}

module.exports = {connect};
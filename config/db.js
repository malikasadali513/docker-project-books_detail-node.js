const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  multipleStatements: true
});

connection.connect((error) => {
  if (error) return console.log(error);
  console.log("connection successfull");
});

module.exports = connection;
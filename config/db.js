const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config({path: './config.env'});


const db = mysql.createPool({
    host: process.env.HOST_NAME,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME
});

module.exports = db.promise();
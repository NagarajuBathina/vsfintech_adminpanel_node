const mysql = require('mysql');

const pool = mysql.createPool({
    host:'62.72.28.52',
    user:'u276789778_stocks',
    password:'123@Mango',
    database:'u276789778_stocks',
})

module.exports = pool;
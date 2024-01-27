require('dotenv').config();


const pg = require('pg');

const config = {
    host:process.env.host,
    user:process.env.user,
    database:process.env.db,
    port:process.env.port,
    password:process.env.password

};

const pool = new pg.Pool(config);

module.exports = {pool};
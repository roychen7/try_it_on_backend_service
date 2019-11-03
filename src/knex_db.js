'use strict';

const knex = require('knex');

const db = exports.db = knex({
    client: 'pg',
    connection: {
        host: process.env.POSTGRES_DB_HOST,
        user: process.env.POSTGRES_DB_USER,
        password: process.env.POSTGRES_DB_PASSWORD,
        database: process.env.POSTGRES_DB_NAME,
        port: 5432,
    }
});
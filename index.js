'use strict';

const knex = require('knex');
const { base64encode, base64decode } = require('nodejs-base64');
const db = knex({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: 'password',
        database: 'postgres',
        port: 5432
    }
});

// USE AS A TEMPLATE
const helloWorld = exports.helloWorld = function helloWorld() {
    if(db) {
        console.log("DB connected");
    }
    return "Hello World";
};

const getUser = exports.getUser = async function getUser(userId) {
    console.log('index.js::getUser');
    return db.where({user_id : userId}).from('users').then(
        users =>  {
            const {
                user_id,
                first_name,
                last_name,
                username,
                email,
                password
            } = users[0];
        
            return {
                user_id:user_id,
                first_name:first_name,
                last_name:last_name,
                username:username,
                email:email,
                password:password
            }
        }
    ).catch(error => {
        throw Error(error);
    })
}

const postUser = exports.postUser = async function postUser(body) {
    console.log('index.js::postUser');

    return db.transaction(trans => {
        
        let userid;

        const encoded = base64encode(body.username);
        console.log(encoded);

        const userRow = {
            user_id: encoded,
            first_name: body.first_name,
            last_name: body.last_name,
            username: body.username,
            email: body.email,
            password: body.password
        }

        return trans.insert(userRow, 'user_id').into('users').then(
            ids => {
                console.log(ids);
                userid = ids[0];
                return {message: "user " + userid + " has been created"};
            }
        )
    }).catch(error => {
        console.log('There has been an error', error);
        throw Error(error);
    })
}
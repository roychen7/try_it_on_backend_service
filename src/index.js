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
    console.log(userId);
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

const getUsers = exports.getUsers = async function getUsers(size) {
    console.log('index.js::getUsers');

    return db.from('users').then(
        users => {
            let retSize;
            let userResults;
            if (size) {
                retSize = size;
                if (retSize > users.length) {
                    retSize = users.length;
                }
                userResults = users.splice(0, retSize);
            } else {
                retSize = users.length;
                userResults = users;
            }
            
            return {
                size: retSize,
                list_of_users: userResults
            };
        }
    ).catch(error => {
        throw Error(error);
    });
}

const postUser = exports.postUser = async function postUser(body) {
    console.log('index.js::postUser');

    const encoded = base64encode(body.username);
    console.log(encoded);

    if (await userAlreadyCreated(encoded)) {
        return { message: 'User already exists.', code: 400 };
    }
    
    return db.transaction(trans => {
        let userid;

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
        console.log('There has been an error:', error);
        throw {message: 'Something is wrong', code: 500};
    })
}

const putUser = exports.putUser = async function putUser(userId, body) {
    console.log('index.js::putUser');

    if (!(body.action && body.value)) {
        throw {
            message: 'There was no action or value',
            error: 400
        }
    }

    return db.transaction(trx => {
        const action = body.action;

        return trx
            .from('users')
            .where({ user_id: userId })
            .update( action, body.value )
            .then(result => {
                if (result === 1) {
                    return { message: 'Successfully changed ' + action + 'for ' + userId, code: 200};
                }
            })
    }).catch(error =>  {
        console.log(error);
        throw { message: 'Something went wrong', code: 500}
    });
}

const userAlreadyCreated = async function userAlreadyCreated(userId) {
    console.log('index.js::userAlreadyCreated');

    return db.select('user_id').where({user_id:userId}).from('users').then(
        ids => {
            console.log(ids);   
            let result;
            if (ids.length === 0) {
                result = false;
            } else {
                result = true;
            }
            return result;
        }
    )
}
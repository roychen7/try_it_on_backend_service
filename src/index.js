'use strict';


const _knex = require('./knex_db.js');
const { base64encode, base64decode } = require('nodejs-base64');
const db = _knex.db;

// USE AS A TEMPLATE
const helloWorld = exports.helloWorld = function helloWorld() {
    return "Hello World";
};

const getUser = exports.getUser = async function getUser(authToken, userId) {
    console.log('index.js::getUser');
    
    if (!authToken) {
        throw {
            message: 'Forbidden - No authToken given',
            code: 401
        }
    }

    if (!userId) {
        throw {
            message: 'Bad request; No given userId',
            code: 400
        }
    }

    return db.where({user_id : userId}).from('users').then(
        users =>  {
            if (users.length === 0) {
                throw {
                    message: 'User was not found',
                    code: 404
                }
            }
          
            const {
                user_id,
                first_name,
                last_name,
                username,
                email,
                password
            } = users[0];

            return {
                user_id: user_id,
                first_name: first_name,
                last_name: last_name,
                username: username,
                email: email,
                password: password
            }
        }
    ).catch(error => {
        console.log(error);
        throw {
            message: error.message,
            code: error.code
        }
    })
}

const getUsers = exports.getUsers = async function getUsers(authToken, size) {
    console.log('index.js::getUsers');

    if (!authToken) {
        throw {
            message: 'Forbidden - No authToken given', 
            code: 401
        }
    }

    if (!size) {
        throw {
            message: 'No size given',
            code: 400
        }
    }

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
        console.log(error);
        throw error;
    });
}

const postUser = exports.postUser = async function postUser(authToken, body) {
    console.log('index.js::postUser');

    if (!authToken) {
        throw {
            message: 'Forbidden - No authToken give',
            code: 401
        }
    }

    if (isEmptyBody(body)) {
        throw {
            message: 'Body was not found',
            code: 400
        };
    }

    const encoded = base64encode(body.username);
    if (await userAlreadyCreated(encoded)) {
        return { message: "user " + encoded + " has already been created", code: 201 };
    }

    return db.transaction(trans => {
        const userRow = {
            user_id: encoded,
            first_name: body.first_name,
            last_name: body.last_name,
            username: body.username,
            email: body.email,
            user_password: body.password,
            first_time: true
        }

        let userid;

        return trans.insert(userRow, 'user_id').into('users').then(
            ids => {
                console.log(ids);
                userid = ids[0];
                if (userid) {
                    return { message: "user " + userid + " has been created", code: 200 };
                }
            }
        )
    }).catch(error => {
        console.log(error);
        throw error;
    })
}

const putUser = exports.putUser = async function putUser(authToken, userId, body) {
    console.log('index.js::putUser');

    if (!authToken) {
        throw {
            message: 'Forbidden - No Auth Token given',
            code: 401
        }
    }

    if (!body || !body.action || !body.value) {
        throw {
            message: 'Request body not found or invalid',
            code: 400
        }
    }

    if (body.action !== 'user_password' && body.action !== 'first_name' && body.action !== 'last_name') {
        throw {
            message: 'Body action invalid',
            code: 405
        }
    }

    if (body.value.length > 50) {
        throw {
            message: 'Input string too long',
            code: 400
        }
    }

    return db.transaction(trx => {
        const action = body.action;

        return trx
            .from('users')
            .where({ user_id: userId })
            .update(action, body.value)
            .then(result => {
                if (result === 1) {
                    return { message: 'Successfully changed ' + action + ' for ' + userId, code: 200 };
                }
            })
    }).catch(error => {
        console.log(error);
        throw { message: 'Something went wrong', code: 500 }
    });
}

const userAlreadyCreated = async function userAlreadyCreated(userId) {
    console.log('index.js::userAlreadyCreated');

    return db.select('user_id').where({ user_id: userId }).from('users').then(
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

const cookieValidation = exports.cookieValidation = async function cookieValidation(sessionId) {
    console.log('index.js::cookieValidation');

    return db.select('session_id').where({ session_id:sessionId }).from('users').then(userSessionId => {
        console.log(userSessionId);
        if (userSessionId[0]) {
            return true;
        } else {
            return false;
        }
    }).catch(error => {
        throw { message: 'Something went wrong', code: 500};
    });
}

const isEmptyBody = function isEmptyBody(body) {
    return (body.constructor == Object && Object.keys(body).length === 0);
}
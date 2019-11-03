'use strict';

const crypto = require('crypto');

const _knex = require('./knex_db.js');
const db = _knex.db;

const helloWorld = exports.helloWorld = async function helloWorld() {
  if (db) {
    return "hello world!";
  } else {
    return "goodbye world :(";
  }
}

const insertSessionId = exports.insertSessionId = async function insertSessionId(username, password) {
  console.log('index.js::getUserByUserAndPass');

  if (!username || username === '') {
    throw {
      message: 'No Username entered',
      code:403
    }
  }
  if (!password || password === '') {
    throw {
      message: "No Password entered",
      code: 403
    };
  }
  console.log("right before db.where");
    return db.from('users').where( {username:username, user_password:password} ).then(users => {
      if (users[0]){
        // return users[0].user_id;
        const user_id = users[0].user_id;
        return db.transaction(trx => {
          console.log("in transaction")
          const session_id = crypto.randomBytes(20).toString('hex');
          return trx.from('users').where({user_id:user_id}).update({session_id:session_id}).then(
            changed => {
              console.log(changed);
              return {
                code: 200,
                message: "changed: " + changed + "session_id: " + session_id
              }
            }
          )
        }).catch(error => {
          throw error;
        })
    } else {
      throw {
        message: "Incorrect username and/or password entered.",
        code: 403
      };
    }
  }).catch(error => {
    throw error;
  })
}
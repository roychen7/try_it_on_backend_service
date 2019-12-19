'use strict';
// For serverless
const serverless = require('serverless-http');
// Import statements from files
const _index = require('./index.js');
const _api_types = require('./api_types');
const _login = require('./login.js');
// Import statements from packages
const express = require('express');
var cookieParser = require('cookie-parser');
// Init express server
const app = express();
const port = 3000;
// Use express settings and features
app.use(express.json());
app.use(cookieParser());
// Check if the cookie is valid
// app.use(async function (req, res, next) {
//   if (req.method === "POST") {
//     next();
//   } else {
//   const sessionCookie = req.cookies.session_id;
//   console.log(sessionCookie);
//   try {
//     const valid = await _index.cookieValidation(sessionCookie);
//     if (valid) {
//       next();
//     } else {
//       throw {message: 'skrt', code: 500};
//     }
//   } catch(error) {
//     res.status(400).send('There is no cookie/cookie is invalid');
//   }
// }
// });

app.post('/users/login', async function (req, res) {
  console.log("app.js:: /users/login POST") 

  try {
    let loginUserBody = new _api_types.LoginUserBody(req.body.username, req.body.password);
    // console.log("before awaiting index call");
    const postSessionIdResult = await _login.insertSessionId(loginUserBody);
    // console.log("after awaiting index call");
    return res.cookie('session_id', postSessionIdResult.session_id, {
      'maxAge': 900000
    }).status(postSessionIdResult.code).send("Successfully sent cookie back to browser!");
  } catch (error) {
    return res.status(error.code).send(error.message)
  }
});

// USE AS A TEMPLATE
app.get('/hello_world', async function (req, res) {
  let result = _index.helloWorld();
  let response = {
    statusCode: 200,
    message: result
  }

  return res.send(response);
});

app.get('/users/:id', async function (req, res) {
  console.log('app.js::getUser');

  const index = req.url.lastIndexOf('/');
  const userId = req.url.substring(index + 1);
  console.log(userId);

  const authToken = req.headers.auth_token;
  console.log(authToken);

  try {
    const result = await _index.getUser(authToken, userId);
    return res.status(200).send(result);
  } catch (error) {
    switch (error.code) {
      case 400:
        return res.status(400).send(error.message);
      case 401:
        return res.status(401).send(error.message);
      case 404:
        return res.status(404).send(error.message);
      default:
        return res.status(500).send('Something went wrong');
    }
  }
});

app.get('/users', async function (req, res) {
  console.log('app.js::getUsers');
  console.log(req.url);
  console.log(req.query);

  const authToken = req.headers.auth_token;
  console.log(authToken);

  try {
    const result = await _index.getUsers(authToken, req.query.size);
    return res.status(200).send(result);
  } catch (error) {
    switch (error.code) {
      case 401:
        return res.status(401).send(error.message);
      case 400:
        return res.status(400).send(error.message);
      default:
        return res.status(500).send('Something went wrong');
    }
  }
});

app.post('/users', async function (req, res) {
  console.log('app.js::postUser');
  console.log(req.body);
  try {
    let createUserBody = new _api_types.CreateUserBody(req.body.first_name, req.body.last_name, req.body.username, req.body.email, req.body.password);
    const result = await _index.postUser(req.headers.auth_token, createUserBody);
    return res.status(result.code).send(result.message);
  } catch (error) {
    switch (error.code) {
      case 400:
        return res.status(400).send(error.message);
      case 401:
        return res.status(401).send(error.message);
      default:
        return res.status(500).send('Something went wrong');
    }
  }
});

app.put('/users/:id', async function (req, res) {
  console.log('app.js::putUser');

  const index = req.url.lastIndexOf('/');
  const userId = req.url.substring(index + 1);
  console.log(userId);

  const authToken = req.headers.auth_token;
  console.log(authToken);

  try {
    const result = await _index.putUser(authToken, userId, req.body);
    return res.status(200).send(result);
  } catch (error) {
    switch (error.code) {
      case 400:
        return res.status(400).send(error.message);
      case 401:
        return res.status(401).send(error.message);
      case 405:
        return res.status(405).send(error.message);
      default:
        return res.status(500).send('Something went wrong');
    }
  }
});

app.listen(port, function () {
  return console.log('App listening on port ' + port + '!');
});

module.exports.handler = serverless(app);
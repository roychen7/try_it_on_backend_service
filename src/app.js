'use strict';
// For serverless
const serverless = require('serverless-http');
// Import statements from files
const _index = require('./index.js');
// const _login = require('./login.js');
// Import statements from packages
const express = require('express');
const _errorHandler = require('./error_handler.js');
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
    console.log("before awaiting index call");
    const postSessionIdResult = await _login.insertSessionId(req.body.username, req.body.password);
    console.log("after awaiting index call");
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
    let errorObject = _errorHandler.errorHandler(error.code, req.path, error.message);
    return res.status(error.code).send("Error: " + errorObject.message + ". " + "Endpoint: " + errorObject.endpoint);
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
    let errorObject = _errorHandler.errorHandler(error.code, req.path, error.message);
    return res.status(error.code).send("Error: " + errorObject.message + ". " + "Endpoint: " + errorObject.endpoint);
  }
});

app.post('/users', async function (req, res) {
  console.log('app.js::postUser');
  console.log(req.body);

  try {
    const result = await _index.postUser(req.headers.auth_token, req.body);
    return res.status(result.code).send(result.message);
  } catch (error) {
    let errorObject = _errorHandler.errorHandler(error.code, req.path, error.message);
    return res.status(error.code).send("Error: " + errorObject.message + ". " + "Endpoint: " + errorObject.endpoint);
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
    let errorObject = _errorHandler.errorHandler(error.code, req.path, error.message);
    return res.status(error.code).send("Error: " + errorObject.message + ". " + "Endpoint: " + errorObject.endpoint);
  }
});

// app.listen(port, function () {
//   return console.log('App listening on port ' + port + '!');
// });

module.exports.handler = serverless(app);
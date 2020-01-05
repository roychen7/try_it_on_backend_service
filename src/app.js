'use strict';
// For serverless
const serverless = require('serverless-http');
// Import statements from files
const _index = require('./index.js');
const _api_types = require('./api_types');
const _login = require('./login.js');
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
app.use(async function (req, res, next) {
  try {
    const sessionCookie = req.cookies.session_id;
    // console.log(sessionCookie);
    const valid = await _index.cookieValidation(sessionCookie);
    if (valid) {
      next();
    } else {
      throw {
        message: 'There is no cookie/cookie is invalid.',
        code: 500
      };
    }
  } catch (error) {
    res.status(error.code).send(error.message + ' Error: ' + error);
  }
});



app.post('/users/login', async function (req, res) {
  console.log("app.js:: /users/login POST") 

  try {
    const loginUserBody = new _api_types.LoginUserBody(req.body.username, req.body.password);
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
  const result = _index.helloWorld();
  const response = {
    statusCode: 200,
    message: result
  }

  return res.send(response);
});

app.get('/users/:id', async function (req, res) {
  console.log('app.js::getUser');

  try {
    const index = req.url.lastIndexOf('/');
    const userId = req.url.substring(index + 1);
    // console.log(userId);
    const authToken = req.headers.auth_token;
    // console.log(authToken);
    const result = await _index.getUser(authToken, userId);
    return res.status(200).send(result);
  } catch (error) {
    let errorObject = _errorHandler.errorHandler(error.code, req.path, error.message);
    return res.status(error.code).send("Error: " + errorObject.message + ". " + "Endpoint: " + errorObject.endpoint);
  }
});

app.get('/users', async function (req, res) {
  console.log('app.js::getUsers');
  // console.log(req.url);
  // console.log(req.query);

  // console.log(authToken);

  try {
    const authToken = req.headers.auth_token;
    const result = await _index.getUsers(authToken, req.query.size);
    return res.status(200).send(result);
  } catch (error) {
    let errorObject = _errorHandler.errorHandler(error.code, req.path, error.message);
    return res.status(error.code).send("Error: " + errorObject.message + ". " + "Endpoint: " + errorObject.endpoint);
  }
});

app.post('/users', async function (req, res) {
  console.log('app.js::postUser');
  // console.log(req.body);

  try {
    const createUserBody = new _api_types.CreateUserBody(req.body.first_name, req.body.last_name, req.body.username, req.body.email, req.body.password);
    const result = await _index.postUser(req.headers.auth_token, createUserBody);
    return res.status(result.code).send(result.message);
  } catch (error) {
    let errorObject = _errorHandler.errorHandler(error.code, req.path, error.message);
    return res.status(error.code).send("Error: " + errorObject.message + ". " + "Endpoint: " + errorObject.endpoint);
  }
});

app.put('/users/:id', async function (req, res) {
  console.log('app.js::putUser');

  try {
    const index = req.url.lastIndexOf('/');
    const userId = req.url.substring(index + 1);
    // console.log(userId);
    const authToken = req.headers.auth_token;
    // console.log(authToken);
    const result = await _index.putUser(authToken, userId, req.body);
    return res.status(200).send(result);
  } catch (error) {
    let errorObject = _errorHandler.errorHandler(error.code, req.path, error.message);
    return res.status(error.code).send("Error: " + errorObject.message + ". " + "Endpoint: " + errorObject.endpoint);
  }
});

app.listen(port, function () {
  return console.log('App listening on port ' + port + '!');
});

module.exports.handler = serverless(app);
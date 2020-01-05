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
    const stateEndpoint = checkUserEndpoint(req.path, req.method);
    if (stateEndpoint) {
      const sessionCookie = req.cookies.session_id;
      const valid = await _index.cookieValidation(sessionCookie);
      if (valid) {
        next();
      } else {
        throw {
          message: 'There is no cookie/cookie is invalid.',
          code: 404
        };
      }
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

const checkUserEndpoint = function checkUserEndpoint(path, methodType) {
  if (path === '/users' && methodType === 'GET') {
    return true;
  } else if (path === '/users/logout' && methodType === 'POST') {
    return true;
  } else if (path.substring(0, path.lastIndexOf('/') + 1) === '/users/' && methodType === 'GET') {
    return true;
  } else if (path.substring(0, path.lastIndexOf('/') + 1) === '/users/' && methodType === 'PUT') {
    return true;
  } else {
    return false;
  }
}

app.post('/users/login', async function (req, res) {
  console.log("app.js:: /users/login POST")

  try {
    const loginUserBody = new _api_types.LoginUserBody(req.body.username, req.body.password);
    const postSessionIdResult = await _login.insertSessionId(loginUserBody);
    return res.cookie('session_id', postSessionIdResult.session_id, {
      'maxAge': 900000
    }).status(postSessionIdResult.code).send("Successfully sent cookie back to browser!");
  } catch (error) {
    return res.status(error.code).send(error.message)
  }
});

app.post('/users/logout', async function (req, res) {
  console.log("app.js:: /users/logout POST");
  try {
    const removeSessionIdResult = await _login.removeSessionId(req.cookies.session_id);
    return res.status(200).send(removeSessionIdResult.message);
  } catch (error) {
    return res.status(error.code).send(error.message);
  }
})

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
    const result = await _index.getUser(userId);
    return res.status(200).send(result);
  } catch (error) {
    let errorObject = _errorHandler.errorHandler(error.code, req.path, error.message);
    return res.status(error.code).send("Error: " + errorObject.message + ". " + "Endpoint: " + errorObject.endpoint);
  }
});

app.get('/users', async function (req, res) {
  console.log('app.js::getUsers');
  try {
    const result = await _index.getUsers(req.query.size);
    return res.status(200).send(result);
  } catch (error) {
    let errorObject = _errorHandler.errorHandler(error.code, req.path, error.message);
    return res.status(error.code).send("Error: " + errorObject.message + ". " + "Endpoint: " + errorObject.endpoint);
  }
});

app.post('/users', async function (req, res) {
  console.log('app.js::postUser');

  try {
    const createUserBody = new _api_types.CreateUserBody(req.body.first_name, req.body.last_name, req.body.username, req.body.email, req.body.password);
    const result = await _index.postUser(createUserBody);
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
    const result = await _index.putUser(userId, req.body);
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
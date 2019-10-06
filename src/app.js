'use strict';
// Import statements from files
const _index = require('./index.js');
// Import statements from packages
const express = require('express');
// Init express server
const app = express();
const port = 3000;
// Use express settings and features
app.use(express.json());

// USE AS A TEMPLATE
app.get('/hello_world', function (req, res) {
  var result = _index.helloWorld();
  console.log(result);
  res.send(result);
});

app.get('/users/:id', async function (req, res) {
  console.log('app.js::getUser');
  console.log(req.url);
  const index = req.url.lastIndexOf('/');
  const userId = req.url.substring(index + 1);
  console.log(userId);
  try {
    if (userId) {
      const result = await _index.getUser(userId);
      return res.send(result);
    } else {
      return res.send('Invalid User ID');
    }
  } catch(error) {
    return res.send(error);
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
    switch(error.code) {
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
  console.log(req.url);
  console.log(req.body);
  if (req.body) {
    const result = await _index.postUser(req.body);
    console.log(result);
    return res.send(result);
  } else {
    return res.send('There is no body');
  }
});

app.put('/users/:id', async function (req, res) {
  console.log('app.js::putUser');

  const index = req.url.lastIndexOf('/');
  const userId = req.url.substring(index + 1);
  console.log(userId);

  try {
    if (userId && req.body) {
      const result = await _index.putUser(userId, req.body);
      return res.send(result);
    } else {
      throw {
        message: 'Body not found',
        code: 400
      }
    }
  } catch (error) {
    return res.send(error);
  }
});

app.listen(port, function () {
  return console.log('App listening on port ' + port + '!');
});

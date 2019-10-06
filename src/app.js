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
  // getting userId from URL
  const index = req.url.lastIndexOf('/');
  const userId = req.url.substring(index + 1);
  console.log(userId);
  // getting authToken from queryParams
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
  console.log(req.body);

  try {
    const result = await _index.postUser(req.headers.auth_token, req.body);
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

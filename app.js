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
  if (userId) {
    const result = await _index.getUser(userId);
    res.send(result);
  } else {
    res.send('Invalid User ID');
  }
});

app.post('/users', async function (req, res) {
  console.log('app.js::postUser');
  console.log(req.url);
  console.log(req.body);
  if (req.body) {
    const result = await _index.postUser(req.body);
    res.send(result);
  } else {
    res.send('There is no body');
  }
});



app.listen(port, function () {
  return console.log('App listening on port ' + port + '!');
});

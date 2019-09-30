'use strict';

const _index = require('./index.js');
const express = require('express');
const app = express();
const port = 3000;

app.get('/hello_world', function (req, res) {
  var result = _index.helloWorld();
  console.log(result);
  res.send(result);
});

app.listen(port, function () {
  return console.log('App listening on port ' + port + '!');
});

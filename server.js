const fs = require('fs');
const express = require('express');
const { Client } = require('pg');
var path = require('path');

// Create app using express
// Also set it to 'know' it is using pug and find where the assets are stored
const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname + '/public/views'));
app.use(express.static(__dirname + '/public'));

// Use heroku's supplied port, default to 3000 for local running
const port = process.env.PORT || 3000;

// Declare the 'controllers'

// index
app.get('/', function(req, res, next) {
  console.log("Serving index page");
  res.sendFile(__dirname + '/index.html');
});


// testing
app.get('/testing', function(req, web_res, next) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });

  client.connect();

  client.query('select * from church where (church.church_id in (select church_id from featured_churches));', (err, res) => {
    if (err) throw err;
    web_res.render("index", {
      featured_churches: res.rows
    });

    client.end();
  });
});


// login
app.get('/login', function(req, res, next) {
  console.log("getting login");
  res.sendFile(__dirname + '/public/html_files/login.html');
});


// church finder
app.get('/church-finder', function(req, res, next) {
  console.log("getting church-finder");
  res.sendFile(__dirname + '/public/html_files/church-finder.html');
})


// listener
app.listen(port, () => {
  console.log(`Server now running at http://${process.env.HOST}:${port}/`);
});

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

Client.defaults.ssl = true;
Client.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT table_schema,table_name FROM information_schema.tables;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});


// Initialize client connection for database queries
/*const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

all_churches = []
featured = []

client.connect();
client.query('SELECT * FROM church;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(row);
    all_churches.push(row);
    console.log(all_churches);
  }
});

console.log(all_churches);

client.query('SELECT * FROM featured_churches;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log("Adding a church to featured_churches");
    console.log(row.church_id);
    featured.push(row.church_id);
    console.log(featured);
  }
});

client.end();*/

// Declare the 'controllers'

// index
app.get('/', function(req, res, next) {
  console.log("Serving index page");
  res.sendFile(__dirname + '/index.html');
});


// testing
app.get('/testing', function(req, res, next) {

  console.log("Testing");
  res.render("index", {
    churches: all_churches,
    featured_churches: featured,
    test_var: "I am testing this  variable"
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

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
app.get('/testing', function(req, res, next) {
  all_churches = []
  featured = []
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });

  client.connect();

  client.query('SELECT * from church;', (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      all_churches.push(row);
      console.log(JSON.stringify(row));
    }
  });

  client.query('SELECT * from featured_churches', (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      var church_id = row.church_id;
      for (church in all_churches) {
        console.log("Current row: " + church_id + " Church Id: " + church.church_id);
        if (church.church_id == church_id) {
          featured.push(church);
          console.log(featured);
          break;
        }
      }
      console.log(JSON.stringify(row));
    }
  });

  console.log("Featured Churches");
  console.log(featured);
  res.render("index", {
    featured_churches: featured
  });

  client.end();
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

const fs = require('fs');
const express = require('express');
const app = express();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

all_churches = []
featured_churches = []

client.query('SELECT * FROM church;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    all_churches.push(row);
  }
});

client.query('SELECT * FROM featured_churches;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    featured_churches.push(row.church_id);
  }
  client.end();
});

for(let church in all_churches) {
  if (church.church_id in featured_churches) {
    console.log(church);
  }
}


app.use(express.static(__dirname + '/public'));

//const hostname = '127.0.0.1'; // Uncomment when testing
const port = process.env.PORT || 3000;

app.get('/', function(req, res, next) {
  console.log("Serving index page");
  res.sendFile(__dirname + '/index.html');
});

app.get('/testing', function(req, res, next) {
  console.log("Testing");
  res.sendFile(__dirname + '/public/pug/new_index.html');
});

app.get('/login', function(req, res, next) {
  console.log("getting login");
  res.sendFile(__dirname + '/public/html_files/login.html');
});

app.get('/church-finder', function(req, res, next) {
  console.log("getting church-finder");
  res.sendFile(__dirname + '/public/html_files/church-finder.html');
})

app.listen(port, () => {
  console.log(`Server now running at http://${process.env.HOST}:${port}/`);
});

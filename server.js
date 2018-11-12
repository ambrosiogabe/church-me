const fs = require('fs');
const express = require('express');
const app = express();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

client.query('SELECT * from church;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});


app.use(express.static(__dirname + '/public'));

//const hostname = '127.0.0.1'; // Uncomment when testing
const port = process.env.PORT || 3000;

app.get('/', function(req, res, next) {
  console.log("Serving index page");
  res.sendFile(__dirname + '/index.html');
});

app.get('/testing', function(req, res, next) {
  console.log("Testing");
  res.sendFile(__dirname + '/pug/new_index.html');
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

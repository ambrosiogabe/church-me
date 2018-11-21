const fs = require('fs');
const express = require('express');
const { Client } = require('pg');
const bodyParser = require("body-parser");
var path = require('path');

// Create app using express
// Also set it to 'know' it is using pug and find where the assets are stored
const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname + '/public/views'));
app.use(express.static(__dirname + '/public'));

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

// Use heroku's supplied port, default to 3000 for local running
const port = process.env.PORT || 3000;

// Declare the 'controllers'

// index
app.get('/', function(req, web_res, next) {
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


app.get('/add_church', function(req, web_res, next) {
  web_res.render("add_church");
});

app.post('/add_church', function(req, web_res, next) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });

  var query_string = "insert into church values ('" + req.body.church.state + "', '" + req.body.church.zip + "', '" + req.body.church.city + "', '" + req.body.church.name + "', '" + req.body.church.long + "', '" + req.body.church.lat + "', '" + req.body.church.video_link + "', '" + req.body.church.image_path + "');";
  client.connect();

  client.query("select (select count(*) from church) as id;" (err, count_res) => {
    if(err) throw err;
    var count = count_res[0].id;
    var query_string = "insert into church values (" + count + ", '" + req.body.church.state + "', '" + req.body.church.zip + "', '" + req.body.church.city + "', '" + req.body.church.name + "', '" + req.body.church.long + "', '" + req.body.church.lat + "', '" + req.body.church.video_link + "', '" + req.body.church.image_path + "');";
    console.log(query_string);
    client.query(query_string, (err, res) => {
      if(err) throw err;
      web_res.redirect('/edit_churches?valid=added');
      client.end();
    });
  });
});


// admin control page
app.get('/edit_churches', function(req, web_res, next) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  var valid = req.query.valid;
  client.connect();

  client.query('select * from church;', (err, res) => {
    if(err) throw err;
    web_res.render("edit_churches", {
      churches: res.rows,
      message: valid
    });

    client.end();
  });
});



// church form and post for church form
app.get('/edit/church/:id', function(req, web_res, next) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });
  var query_string = 'select * from church where church_id = ' + req.params.id;

  client.connect();

  client.query(query_string, (err, res) => {
    if(err) throw err;
    web_res.render("church_form", {
      church: res.rows[0]
    });

    client.end();
  });
});

app.post('/edit/church/:id', function(req, web_res, next) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });

  var query_string = "update church set church_state = '" + req.body.church.state + "', church_zip = '" + req.body.church.zip + "', church_city = '" + req.body.church.city + "', church_name = '" + req.body.church.name + "', gps_long = '" + req.body.church.long + "', gps_lat = '" + req.body.church.lat + "', video_link = '" + req.body.church.video_link + "', image_path = '" + req.body.church.image_path + "' where church_id = " + req.params.id + ";";
  console.log(query_string);
  client.connect();

  client.query(query_string, (err, res) => {
    if(err) throw err;
    web_res.redirect('/edit_churches?valid=true');
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

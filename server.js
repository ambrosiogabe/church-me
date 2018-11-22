const fs = require('fs');
const express = require('express');
const { Client } = require('pg');
const bodyParser = require("body-parser");
var path = require('path');

// Create app using express
// Also set it to 'know' it is using pug and find where the assets are stored
const app = express();
var ssn;
app.set("view engine", "pug");
app.set("views", path.join(__dirname + '/public/views'));
app.use(express.static(__dirname + '/public'));

var session = require('express-session');
var MemcachedStore = require('connect-memjs')(session);
// Session config
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: 'true',
  saveUninitialized: 'true',
  store: new MemcachedStore({
    servers: [process.env.MEMCACHIER_SERVERS],
    prefix: '_session_'
  })
}));


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
  ssn = req.session;

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });

  client.connect();

  client.query('select * from church where (church.church_id in (select church_id from featured_churches));', (err, res) => {
    if (err) throw err;
    web_res.render("index", {
      featured_churches: res.rows,
      logged_in: ssn.logged_in
    });

    client.end();
  });
});


app.get('/add_church', function(req, web_res, next) {
  ssn = req.session;
  web_res.render("add_church", {
    logged_in: ssn.logged_in
  });
});

app.post('/add_church', function(req, web_res, next) {
  ssn = req.session;
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });

  var query_string = "insert into church values ('" + req.body.church.state + "', '" + req.body.church.zip + "', '" + req.body.church.city + "', '" + req.body.church.name + "', '" + req.body.church.long + "', '" + req.body.church.lat + "', '" + req.body.church.video_link + "', '" + req.body.church.image_path + "');";
  client.connect();

  client.query("select (select count(*) from church) as id;", (err, count_res) => {
    if(err) throw err;
    console.log(count_res);
    var count = count_res.rows[0].id;
    var query_string = "insert into church values (" + count + ", '" + req.body.church.state + "', '" + req.body.church.zip + "', '" + req.body.church.city + "', '" + req.body.church.name + "', '" + req.body.church.long + "', '" + req.body.church.lat + "', '" + req.body.church.video_link + "', '" + req.body.church.image_path + "');";
    client.query(query_string, (err, res) => {
      if(err) throw err;
      web_res.redirect('/edit_churches?valid=added');
      client.end();
    });
  });
});


// admin control page
app.get('/edit_churches', function(req, web_res, next) {
  ssn = req.session;
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
      message: valid,
      logged_in: ssn.logged_in
    });

    client.end();
  });
});


// feature churches
app.get('/featured', function(req, web_res, next) {
  ssn = req.session;
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });
  client.connect();

  client.query('select * from church;', (err, res) => {
    if(err) throw err;
    web_res.render("feature", {
      churches: res.rows,
      logged_in: ssn.logged_in
    });

    client.end();
  });
});

app.post('/featured', function(req, web_res, next) {
  ssn = req.session;
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  client.connect();

  client.query("delete from featured_churches where church_id != -1;", (err, res) => {
    if(err) throw err;
    var query_string = "";
    for (var id in req.body.featured_churches) {
      query_string += " insert into featured_churches values (" + id + "); ";
    }
    client.query(query_string, (err, res) => {
      if(err) throw err;
      web_res.redirect('/edit_churches?valid=featured');
      client.end();
    });
  });
});

// logout
app.get('/logout', function(req, web_res, next) {
  ssn = req.session;
  ssn.logged_in = false;
  web_res.redirect('/login?valid=logged_out')
});

// church form and post for church form
app.get('/edit/church/:id', function(req, web_res, next) {
  ssn = req.session;
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });
  var query_string = 'select * from church where church_id = ' + req.params.id;

  client.connect();

  client.query(query_string, (err, res) => {
    if(err) throw err;
    web_res.render("church_form", {
      church: res.rows[0],
      logged_in: ssn.logged_in
    });

    client.end();
  });
});

app.post('/edit/church/:id', function(req, web_res, next) {
  ssn = req.session;
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
  ssn = req.session;
  var valid = req.query.valid;
  res.render("login", {
    message: valid,
    logged_in: ssn.logged_in
  });
});

app.post('/login', function(req, web_res, next) {
  ssn = req.session;
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });
  client.connect();

  var username = req.body.user.username;
  var password = req.body.user.password;

  client.query("select * from admin where username = 'administrator'", (err, res) => {
    if(err) throw err;
    var new_username = res.rows[0].username;
    var new_password = res.rows[0].password;
    if (new_username == username && new_password == password) {
      ssn.logged_in = true;
      web_res.redirect('/edit_churches?valid=login')
    } else {
      web_res.redirect('/login?valid=failed')
    }

    client.end();
  });
});


// church finder
app.get('/church-finder', function(req, res, next) {
  ssn = req.session;
  res.render("church-finder", {
    logged_in: ssn.logged_in
  });
})

// listener
app.listen(port, () => {
  console.log(`Server now running at http://${process.env.HOST}:${port}/`);
});

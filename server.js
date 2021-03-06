const fs = require('fs');
const express = require('express');
const { Client } = require('pg');
const bodyParser = require("body-parser");
const path = require('path');
const nodemailer = require('nodemailer');

//const utils = require("./utils");

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

app.post('/', function(req, web_res, next) {
  ssn = req.session;

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });

  var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'churchme10@gmail.com',
      pass: process.env.CHURCHME_PASS
    }
  });
  console.log(process.env.CHURCHME_PASS)
  var mailOptions = {
    from: 'churchme10@gmail.com',
    to: 'bill77broadcast@gmail.com',
    subject: 'Message from ' + req.body.name + " email: " + req.body.email + " phone: " + req.body.phone,
    text: req.body.message
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
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

  var query_string = "insert into church values ('" + req.body.church.state + "', '" + req.body.church.zip + "', '" + req.body.church.city + "', '" + req.body.church.address + "', '" + req.body.church.name + "', '" + req.body.church.long + "', '" + req.body.church.lat + "', '" + req.body.church.video_link + "', '" + req.body.church.image_path + "', '" + req.body.church.link + "' )";
  client.connect();

  client.query("select (select count(*) from church) as id;", (err, count_res) => {
    if(err) throw err;
    console.log(count_res);
    var count = count_res.rows[0].id;
    var query_string = "insert into church values (" + count + ", '" + req.body.church.state + "', '" + req.body.church.zip + "', '" + req.body.church.city + "', '" + req.body.church.address + "', '" + req.body.church.name + "', '" + req.body.church.long + "', '" + req.body.church.lat + "', '" + req.body.church.video_link + "', '" + req.body.church.image_path + "', '" + req.body.church.link + "' )";
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

  var query_string = "update church set church_state = '" + req.body.church.state + "', church_zip = '" + req.body.church.zip + "', church_city = '" + req.body.church.city + "', church_name = '" + req.body.church.name + "', gps_long = '" + req.body.church.long + "', gps_lat = '" + req.body.church.lat + "', video_link = '" + req.body.church.video_link + "', image_path = '" + req.body.church.image_path + "', church_address = '" + req.body.church.address + "', church_link = '" + req.body.church.link +  "' where church_id = " + req.params.id + ";";
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

  /*
   * Secure Login Verification
   * -------------------------
   * Before uncommenting:
   *    - Obtain an SSL certificate and redefine "\login" to point to an HTTPS address (in both this file and in the
   *      corresponding `form` element). This is absolutely essential; without it, any attacker could easily intercept
   *      sensitive data on its way to/from the server. Getting an SSL certificate on Heroku requires payment, so the
   *      client should be made to do this, unless he would rather be at constant risk of attack.
   *
   * 	- Insert `password` column in `admin` table. It should be of type CHAR(65).
   *
   *    - Uncomment `require(./utils)` statement at the top of the page. If "utils.js" was moved from the top-level folder,
   *      edit the argument to `require` accordingly.
   */

  /*
  var redirectAddr = "/login?valid=failed";

  // ensures that `username` is sanitary (i.e. consists only of letters, numbers, and underscore)
  if (username.search(/\W/) != -1)
	  web_res.redirect(redirectAddr);
  client.query(`SELECT * FROM admin WHERE username = ${username}`, function(err, res)
  {
	  if (err)
		  throw err;
	  else if (res.rows.length && utils.verifyHash(password, res.rows[0].password))
		  // successful login
		  web_res.redirect("/edit_churches?valid=login");
	  else
		  // incorrect username or password
		  web_res.redirect(redirectAddr);
  }
  */

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
app.get('/church-finder', function(req, web_res, next) {
  ssn = req.session;
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });
  client.connect();

  client.query('select * from church;', (err, res) => {
    if(err) throw err;
    web_res.render("church-finder", {
      churches: res.rows,
      logged_in: ssn.logged_in
    });

    client.end();
  });
})

app.post('/church-finder', function(req, web_res, next) {
  ssn = req.session;
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });
  client.connect();

  client.query("select * from church where church_zip = '" + req.body.zip + "'", (err, res) => {
    if(err) throw err;
    web_res.render("church-finder", {
      churches: res.rows,
      logged_in: ssn.logged_in
    });

    client.end();
  });
})

// listener
app.listen(port, () => {
  console.log(`Server now running at http://${process.env.HOST}:${port}/`);
});

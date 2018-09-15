const fs = require('fs');
const express = require('express');
const app = express();


app.use(express.static(__dirname + '/public'));

//const hostname = '127.0.0.1'; // Uncomment when testing
const port = process.env.PORT || 3000;

app.get('/', function(req, res, next) {
  res.sendfile(__dirname + '/index.html');
})

//app.listen(port, hostname, () => { // Uncomment when testing and comment next line instead
app.listen(port, () => {
  console.log(`Server running at http://${process.env.HOST}:${port}/`);
});

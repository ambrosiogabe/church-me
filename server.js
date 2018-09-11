const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 500;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  console.log("Doing it");
  fs.readFile("index.html", function(err, data){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
});

server.listen(PORT, () => {
  console.log(`Server running at ${PORT}/`);
});

// The only reason this javascript is loaded at the top of the file is because it is pertinent code to accessing the database
// DO NOT put regular javascript in here
const { Client } = require('pg');
clientInfo = {connectionString: process.env.DATABASE_URL, ssl:true};

const client = new Client(clientInfo);

client.connect();

client.query('SELECT * FROM CHURCH;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});

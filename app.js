const http = require('http')
const fs = require('fs')

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/html' });
  fs.createReadStream('index.html').pipe(res);
  console.log(
  `User Connected. HTTP Version: ${req.httpVersion} Method: ${req.method} URL: ${req.url} Remote Host: ${req.socket.remoteAddress}`);
});


server.listen(3000);
console.log("Listening on port 3000.");
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8082;

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, 'e2e', 'test-app.html');
  
  if (req.url === '/' || req.url === '/index.html') {
    filePath = path.join(__dirname, 'e2e', 'test-app.html');
  }
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}`);
});

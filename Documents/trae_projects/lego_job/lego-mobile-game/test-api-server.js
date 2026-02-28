const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8084;

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, 'e2e', 'test-app-api.html');
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`API联动测试服务器运行在 http://localhost:${PORT}`);
  console.log(`后端API地址: http://localhost:8788`);
});

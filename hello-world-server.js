var http = require('http');
http.createServer(function handler(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
}).listen(5858, '127.0.0.1');
console.log('Server running at http://127.0.0.1:5858/');

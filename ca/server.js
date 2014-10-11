var http = require('http');

http.createServer(function (req, res) {
	console.log("Received a request");	
	res.writeHead(200, {"Content-Type": "text/plain"});
	res.end("Hello world");
}).listen(3005);

console.log("Server runing");

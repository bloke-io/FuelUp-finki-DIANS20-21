const http = require('http');
const server = http.createServer(function (req, res){
    res.setHeader('Content-type', 'index.html');
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.writeHead(200);

    res.end(index.html);
});




server.listen(8080);
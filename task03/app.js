const http = require('http')
const fs = require('fs')
const port = 8080

const server = http.createServer(function (req, res){
    res.writeHead(200, {'Content-type' : 'text/html'})
    fs.readFile('index.html', function(data){
        res.write(data)
        res.end()
    })
})

server.listen(port)
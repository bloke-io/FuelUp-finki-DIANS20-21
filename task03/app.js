const http = require('http');
<<<<<<< HEAD
const fs = require('fs');
const port = 8080;

const server = http.createServer(function (req, res){
    res.writeHead(200, {'Content-type' : 'text/html'})
    fs.readFile('index.html', function (error, data){
        if(error){
            res.writeHead(404)
            res.write('Error: file not found')
        }else {
            res.write(data)
        }
        res.end()
    })

})

server.listen(port, function (error){
    if(error){
        console.log('Something went wrong', error)
    }else{
        console.log('Server is listening on port' + port)
    }
})
=======
const fs = require('fs').promises;
const server = http.createServer(function (req, res){
    fs.readFile(__dirname + "/index.html")
        .then(contents => {
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(contents);
        })
});

>>>>>>> 60c8435c517762a81bb0f6490d0be00f05294fbb

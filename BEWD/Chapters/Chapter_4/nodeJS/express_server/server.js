const express = require('express');
var serveStatic = require('serve-static');
var path = require('path');
const app = express();
const port = 3000;
const hostname = 'localhost';

app.use(function (req, res, next) {
    console.log('Time:', Date.now())
    console.log(req.url);
    console.log(req.method)
    console.log(req.path);
    console.log(req.query.id);
    res.status(200);
    next()
})

app.get('/index',function (req,res) {
    res.sendFile(path.join(__dirname,'/public/index.html'));

})
app.listen(port, hostname, ()=>{
    console.log(`Server started and accessible via http://${hostname}:${port}/` );
    }
)
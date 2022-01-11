let express = require('express');
let path = require('path')
let port = 8001;
let hostname = 'localhost';
let app = express();

app.use(express.urlencoded({
    extended:false
}));
app.use(express.json());



app.all('/api/request', (req, res,next)=>{
    var userInfo = {
    username: req.body.username,
    password: req.body.password,
    request_type: req.body.request_type
    }
    module.exports = userInfo
    console.log(`Incoming ${req.method} request`)
    console.log(`User Info exported: \n- ${userInfo.username}\n- ${userInfo.password}\n- ${userInfo.request_type} request`)
    next()
}
)

app.get('/api/request', (req, res) => {
    res.sendFile(path.join(__dirname,'/public/GET_Request.html'));
    }
);

app.post('/api/request', (req, res) => {
    res.sendFile(path.join(__dirname,'/public/POST_Request.html'));
    }
);

app.delete('/api/request',(req,res)=>{
    res.sendFile(path.join(__dirname, '/public/DELETE_Request.html'));
    }
)

app.put('/api/request', (req, res)=>{
    res.sendFile(path.join(__dirname,'/public/PUT_Request.html'))
    }
)

app.listen(port,hostname,()=>{
    console.log(`Server started and accessible via http://${hostname}:${port}/`)
    }
)
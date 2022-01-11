let express = require('express');
let app = express();
let dbFunc = require('../model/databaseConnect.js')
let bodyParser = require('body-parser');
let urlEncodedParser = bodyParser.urlencoded({
    extended : false
})

app.use(bodyParser.json());
app.use(urlEncodedParser);



app.get('/api/user/:userid', function (req, res){
    let userid = req.params.userid;
    dbFunc.getUser(userid, function(err,result){
        if (err){
            res.sendStatus(err)
        }
        else{
            res.status(200).send(result)
        }
    })

})

app.get('/api/users', function(req, res){
    dbFunc.getAllUsers(function(err,result){
        if(!err){
            res.send(result)
        }else{
            res.status(500).send('Unable to retrieve all users. Server Error.')
        }
    })
})

app.post('/api/user',function(req, res){
    let username = req.body.username
    let email =  req.body.email
    let role = req.body.role
    let password = req.body.password
    dbFunc.addUser(username, email, role, password, function(err, result){
    if(err){
        res.status(500).send(`Unable to add user. Server Error.`)
    }else{
        res.send(result + ' record added.')
    }
    })
})

app.put('/api/user/edit/:userid', function(req, res){
    let userid = req.params.userid
    let username = req.body.username
    let email = req.body.email
    let role = req.body.role
    let password = req.body.password
    dbFunc.editUser(userid,username,email,role,password,function(err,result){
        if (err){
            res.sendStatus(err);
        }else {
            dbFunc.getUser(userid, function(err,result){
                if (err){
                    res.sendStatus(err)
                }
                else{
                    res.status(200).send(result)
                }
            })
        }
    })

})




module.exports = app

// p2112646
// Justin Wong Juin Hng
// DAAA/1B/04

const fs = require("fs");
const express = require('express');
const cors = require('cors')
const app = express();
const dbFunc = require('../model/databaseConnect.js')
const bodyParser = require('body-parser');
const path = require('path');
const sharp = require('sharp');
const multer = require('multer')
const pug = require('pug')
const urlEncodedParser = bodyParser.urlencoded({
    extended : false
})
const base64Img = require('base64-img');
app.use(express.static(path.join(__dirname, '../uploads')));
console.log(path.join(__dirname, '../uploads'))
app.use(bodyParser.json());
app.use(urlEncodedParser);

var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'uploads/')     // 'uploads/' directory name where save the file
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
})
var upload = multer({
    storage: storage
});

app.set('view engine', 'pug'); //templating engine used to show image and json data in html file when getting specific
                               //specific product data






//endpoint 1
app.post('/users',function(req, res){
    let username = req.body.username
    let contact = req.body.contact
    let password = req.body.password
    let type = req.body.type
    let profile_pic_url = req.body.profile_pic_url
    dbFunc.addUser(username,contact,password,type, profile_pic_url, function(err, result){ //call function addUser
    if(err){
        res.sendStatus(err)
    }else{
        res.status(201).send(result) //user added successfully. success code 201 passed.
    }
    })
})




//endpoint 2
app.get('/users', function(req, res){
    dbFunc.getAllUsers(function(err,result){ //call function getAllUsers
        if(err){
            res.sendStatus(err)
        }else{
            res.status(200).send(result) //task successful. success code 200 passed
        }
    })
})




//endpoint 3
app.get('/users/:id', function (req, res){
    let userid = req.params.id;
    dbFunc.getUser(userid, function(err,result){ //call function getUser
        if (err){
            res.sendStatus(err) //task failed. error code passed.
        }
        else{
            res.status(200).send(result) //task successful. success code 200 passed.
        }
    })

})




//endpoint 4
app.put('/users/:id', function(req, res){
    let userid = req.params.id
    let username = req.query.username
    let contact = req.query.contact
    let password = req.query.password
    let type = req.query.type
    let profile_pic_url = req.query.profile_pic_url
    let arr = [username,contact,password,type,profile_pic_url]
    dbFunc.editUser(userid,username,contact,password,type, profile_pic_url,arr,function(err,result){ //call function editUser
        if (err){
            res.sendStatus(err); //user edit failed. error code passed.
        }else {
            res.sendStatus(204) //user edit successful. success code 204 passed.
        }
    })
})


//endpoint 5
app.post('/category', function(req, res){
    let category = req.body.Category
    let description = req.body.Description
    dbFunc.addCategory(category,description,function(err,result){
        if (err){
            res.sendStatus(err)
        }else{
            res.status(204).send(result)
        }
    })
})


//endpoint 6
app.get('/category',function(req,res){
    dbFunc.getAllCategories(function(err,result){
        if(err){
        res.sendStatus(err)
        }else{
        res.status(200).send(result)
        }
    })

})


//endpoint 7
app.post('/product',upload.single('file'),function(req,res){
    let name = req.body.name
    let description = req.body.description
    let category_id = req.body.category_id
    let brand = req.body.brand
    let price = req.body.price
    let img_name = req.file.filename
    fs.stat(`uploads/${img_name}`, (err, stats) => {
        if (err) {
            console.log(`File doesn't exist.`)
            res.sendStatus(500)
        } else {
            if (stats.size<=1000000){
                console.log(stats.size)
               dbFunc.addProduct(name,description,category_id,brand,price,img_name,function(err,result){
                    if(err){
                        res.sendStatus(err)
                    }else{
                        res.status(201).send(result)
                    }
                });
            }
            else{
                console.log('addProduct : File size too big.')
                res.sendStatus(500)
            }
        }
    });
})



//endpoint 8 GET /product/:id
app.get('/product/:id', function(req,res){
    let id = req.params.id
    dbFunc.getProduct(id,function(err,result){
        if(err){
            res.sendStatus(err)
        }else{
            res.status(200).render('index', { title: 'Hey', src: `http://localhost:8001/${result[0].product_image_src}`,result})


        }
    })
})


//endpoint 9 DELETE /product/:id
app.delete('/product/:id', function(req,res){
    let id = req.params.id

    dbFunc.deleteProduct(id,function(err,result){
        if(err){
            res.send(err)
        }else{
            res.status(204).send(result)
        }
    })
})


//endpoint 10 POST /product/:id/review/
app.post('/product/:id/review', function(req,res){
    let userid = req.body.user_id
    let product_id = req.params.id
    let rating = req.body.rating
    let review = req.body.review
    dbFunc.addReview(userid,product_id,rating,review,function(err,result){
        if(err){
            res.send(err)
        }else{
            res.status(200).send(result)
        }
    })
})

//endpoint 11 GET /product/:id/reviews
app.get('/product/:id/reviews', function(req,res){
    let productid = req.params.id
    dbFunc.getSpecificReview(productid,function(err,result){
        if(err){
            res.send(err)
        }else{
            res.status(200).send(result)
        }
    })
})

//endpoint 12 POST /interest/:userid
app.post('/interest/:userid', function(req,res){
    let id = req.params.userid
    let categoryids = req.body.categoryids.split(',')
    dbFunc.createInterest(id,categoryids,function(err){
        if(err){
            res.sendStatus(err)
        }else{
            res.sendStatus(201)
        }
    })
})





//endpoint 13
app.delete('/users/delete', function(req,res){
    let table = req.body.table
    dbFunc.deleteTable(table,function(err,result){
        if (err)
        {
            res.sendStatus(err)
        }
        else{
            switch (table) {
                case 'userinfo':
                    dbFunc.getAllUsers(function (err, result) {
                        if (err) {
                            res.status(500).send('Unable delete table. Server Error.')
                        } else {
                            res.status(200).send(result) //user deleted successfully. success code 200 passed
                        }
                    })
                    break;
                case 'products':
                    dbFunc.getAllProducts(function(err,result){
                        if(err){
                            res.sendStatus(err).send('Unable delete table. Server Error.')
                        }else{
                            res.status(200).send(result)
                        }
                    })
                    break;
                case 'product_categories':
                    dbFunc.getAllCategories(function (err,result){
                        if(err){
                            res.status(500).send('Unable delete table. Server Error.')
                        }else{
                            res.status(200).send(result)
                        }
                    })
                    break;
                case 'product_reviews':
                    dbFunc.getAllReviews(function(err,result){
                        if (err){
                            res.send(err)
                        }
                        else{
                            res.status(200).send(result)
                        }
                    })
                    break;
                default:
                    res.sendStatus(500)
            }

        }
    })
})




//endpoint 14
app.delete('/users/delete/:id', function(req, res){
    let userid = req.params.id
    dbFunc.deleteUser(userid, function(err,result){
        if (err){
            res.sendStatus(err)
        }else{
            dbFunc.getAllUsers(function(err,result){
                if(err){
                    res.status(500).send('Unable to retrieve all users. Server Error.')
                }else{
                    res.status(200).send(result) //specific user deleted. success code 200 passed
                    }
                })
            }
        }
    )
})



//endpoint 15
app.get('/product', function(req,res){
    dbFunc.getAllProducts(function (err,result){
        if(err){
            res.sendStatus(err)
        }else{
            res.status(200).send(result)
        }
    })
})


//endpoint 16
app.get('/category/:id', function(req,res){
    let id = req.params.id
    dbFunc.getAlProductsWithinCategory(id,function(err,result){
        if(err){
            res.sendStatus(err)
        }else{
            res.status(200).send(result)
        }
    })
})

//endpoint 17
app.get('/products/reviews', function(req,res){
    dbFunc.getAllReviews(function(err,result){
        if(err){
            res.send(err)
        }else{
            res.status(200).send(result)
        }
    })
})

module.exports = app

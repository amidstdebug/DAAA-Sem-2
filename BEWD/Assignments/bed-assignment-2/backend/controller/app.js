// p2112646
// Justin Wong Juin Hng
// DAAA/1B/04

const fs = require("fs");
const express = require('express');
const cors = require('cors')
const app = express();
const dbFunc = require('../model/databaseConnect.js')
const bodyParser = require('body-parser');
const multer = require('multer')
const urlEncodedParser = bodyParser.urlencoded({
    extended: false
})
const verifyToken = require('../auth/verifyToken.js');


app.use(bodyParser.json());
app.use(urlEncodedParser);
app.use(cors());


var storage_profile = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './assets/uploads/pfp')     // 'uploads/' directory name where save the file
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
})
var upload_profile = multer({
    storage: storage_profile
});

var storage_product = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './assets/uploads/v2 images')     // 'uploads/' directory name where save the file
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
})
var upload_product = multer({
    storage: storage_product
});


app.get('/verify', verifyToken, function (req, res) {
    let type = req.type
    let userid = req.userid
    let result = {
        'type': type,
        'userid': userid
    }
    res.send(result)
})


app.get('/catcheck/:id', function (req, res) {
    let id = req.params.id
    dbFunc.categoryCheck(id, function (err, result) {
        if (err) {
            res.send(err)
        } else {
            res.status(200).send(result)
        }
    })
})


app.post('/users', upload_profile.single('file'), function (req, res) {
    let username = req.body.username
    let email = req.body.email
    let contact = req.body.contact
    let password = req.body.password
    let type = req.body.type
    let profile_pic_url = req.file.filename
    fs.stat(`./assets/uploads/pfp/${profile_pic_url}`, (err, stats) => {
        if (err) {
            console.log(`File doesn't exist.`)
            res.sendStatus(500)
        } else {
            if (stats.size <= 1000000) {
                dbFunc.addUser(username, email, contact, password, type, profile_pic_url, function (err, result) { //call function addUser
                    if (err) {
                        res.sendStatus(err)
                    } else {
                        res.status(201).send(result) //user added successfully. success code 201 passed.
                    }
                })
            } else {
                try {
                    fs.unlinkSync(`./assets/uploads/pfp/${profile_pic_url}`)
                    console.log('addUser : File size too big.')
                    res.sendStatus(500)
                } catch (err) {
                    console.error(err)
                }

            }
        }
    });
})


app.post('/users/login', function (req, res) {
    let email = req.body.email
    let password = req.body.password
    dbFunc.userLogin(email, password, function (err, result) {
        if (err) {
            res.send(err)
        } else {
            res.status(200).send(result)
        }
    })
})

app.get('/users', verifyToken, function (req, res) {
    let type = req.type
    console.log(type)
    dbFunc.getAllUsers(type, function (err, result) { //call function getAllUsers
        if (err) {
            res.sendStatus(err)
        } else {
            res.status(200).send(result) //task successful. success code 200 passed
        }
    })
})


//endpoint 3
app.get('/users/:id', function (req, res) {
    let userid = req.params.id;
    dbFunc.getUser(userid, function (err, result) { //call function getUser
        if (err) {
            res.sendStatus(err) //task failed. error code passed.
        } else {
            res.status(200).send(result) //task successful. success code 200 passed.
        }
    })

})


//endpoint 4
app.put('/users/:id', verifyToken, function (req, res) {
    let type1 = req.type
    let userid = req.params.id
    let username = req.query.username
    let email = req.query.email
    let contact = req.query.contact
    let password = req.query.password
    let type2 = req.query.type
    let profile_pic_url = req.query.profile_pic_url
    let arr = [username, email, contact, password, type2, profile_pic_url]
    dbFunc.editUser(userid, username, email, contact, password, type2, profile_pic_url, arr, type1, function (err, result) { //call function editUser
        if (err) {
            res.sendStatus(err); //user edit failed. error code passed.
        } else {
            res.sendStatus(204) //user edit successful. success code 204 passed.
        }
    })
})


//endpoint 5
app.post('/category', verifyToken, function (req, res) {
    let type = req.type
    let category = req.body.Category
    let description = req.body.Description
    console.log(req.body)
    dbFunc.addCategory(category, description, type, function (err, result) {
        if (err) {
            res.sendStatus(err)
        } else {
            res.status(201).send(result)
        }
    })
})


//endpoint 6
app.get('/category', function (req, res) {
    dbFunc.getAllCategories(function (err, result) {
        if (err) {
            res.sendStatus(err)
        } else {
            res.status(200).send(result)
        }
    })

})


//endpoint 7
app.post('/product', verifyToken, upload_product.single('file'), function (req, res) {
    let type = req.type
    let name = req.body.name
    let description = req.body.description
    let category_id = req.body.category_id
    let brand = req.body.brand
    let price = req.body.price
    let img_name = req.file.filename
    let category_name = req.body.category_name
    if (type == 'admin') {
        fs.stat(`./assets/uploads/v2 images/${img_name}`, (err, stats) => {
            if (err) {
                console.log(`File doesn't exist.`)
                console.log(err)
                res.sendStatus(500)
            } else {
                if (stats.size <= 1000000) {
                    dbFunc.addProduct(name, description, category_id, brand, price, img_name, category_name, function (err, result) {
                        if (err) {
                            res.sendStatus(err)
                        } else {
                            res.status(201).send(result)
                        }
                    });
                } else {
                    fs.unlinkSync(`./assets/uploads/v2 images/${img_name}`)
                    console.log('addProduct : File size too big.')
                    res.sendStatus(500)
                }
            }
        });
    } else {
        res.sendStatus(401)
    }
})

app.put('/product/:id', verifyToken, upload_product.single('file'), verifyToken, function (req, res) {
    let type1 = req.type
    let product_id = req.params.id
    let category_id = req.body.category_id
    let name = req.body.name
    let description = req.body.description
    let brand = req.body.brand
    let price = req.body.price
    let product_image_src = req.file.filename
    let category_name = req.body.category_name
    let arr = [product_id, category_id, name, description, brand, price, product_image_src, category_name]
    console.log('????')
    if (type1 == 'admin') {
        fs.stat(`../../bed-assignment-2/frontend/public/assets/uploads/v2 images/${product_image_src}`, (err, stats) => {
            if (err) {
                console.log(`File doesn't exist.`)
                console.log(err)
                res.sendStatus(500)
            } else {
                if (stats.size <= 1000000) {
                    dbFunc.editProduct(product_id, category_id, name, description, brand, price, product_image_src, category_name, arr, type1, function (err, result) { //call function editUser
                        if (err) {
                            res.sendStatus(err); //product edit failed. error code passed.
                        } else {
                            res.sendStatus(201) //product edit successful. success code 204 passed.
                        }
                    })
                } else {
                    console.log('addProduct : File size too big.')
                    res.sendStatus(500)
                }
            }
        });
    } else {
        res.sendStatus(401)
    }
})


//endpoint 8 GET /product/:id
app.get('/product/:id', function (req, res) {
    let id = req.params.id
    dbFunc.getProduct(id, function (err, result) {
        if (err) {
            res.sendStatus(err)
        } else {
            res.status(200).send(result)


        }
    })
})


//endpoint 9 DELETE /product/:id
app.delete('/product/:id', verifyToken, function (req, res) {
    let id = req.params.id
    let type = req.type
    if (type == 'admin') {
        dbFunc.deleteProduct(id, function (err, result) {
            if (err) {
                res.send(err)
            } else {
                res.status(204).send(result)
            }
        })
    } else {
        res.sendStatus(401)
    }

})


//endpoint 10 POST /product/:id/review/
app.post('/product/:id/review', verifyToken, function (req, res) {
    let userid = req.body.user_id
    let product_id = req.params.id
    let rating = req.body.rating
    let review = req.body.review
    let type = req.type
    if (type == 'admin' || type == 'customer') {
        dbFunc.addReview(userid, product_id, rating, review, function (err, result) {
            if (err) {
                res.send(err)
            } else {
                res.status(200).send(result)
            }
        })
    }

})

//endpoint 11 GET /product/:id/reviews
app.get('/product/:id/reviews', function (req, res) {
    let productid = req.params.id
    dbFunc.getSpecificReview(productid, function (err, result) {
        if (err) {
            res.send(err)
        } else {
            res.status(200).send(result)
        }
    })
})

//endpoint 12 POST /interest/:userid
app.post('/interest/:userid', verifyToken, function (req, res) {
    let id = req.params.userid
    let type = req.type
    let categoryids = req.body.categoryids.split(',')
    if (type == 'admin' || type == 'customer') {
        dbFunc.createInterest(id, categoryids, function (err) {
            if (err) {
                return res.sendStatus(err)
            } else {
                return res.sendStatus(201)
            }
        })
    } else {
        return res.sendStatus((401))
    }

})

app.get('/interest/:userid', verifyToken, function (req, res) {
    let userid = req.params.userid
    dbFunc.checkInterest(userid, function (err, result) {
        if (err) {
            res.send(err)
        } else {
            res.status(200).send(result)
        }
    })
})


//endpoint 13
app.delete('/users/delete', verifyToken, function (req, res) {
    let table = req.body.table
    let type = req.type
    if (type == 'admin') {
        dbFunc.deleteTable(table, function (err, result) {
            if (err) {
                res.sendStatus(err)
            } else {
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
                        dbFunc.getAllProducts(function (err, result) {
                            if (err) {
                                res.sendStatus(err).send('Unable delete table. Server Error.')
                            } else {
                                res.status(200).send(result)
                            }
                        })
                        break;
                    case 'product_categories':
                        dbFunc.getAllCategories(function (err, result) {
                            if (err) {
                                res.status(500).send('Unable delete table. Server Error.')
                            } else {
                                res.status(200).send(result)
                            }
                        })
                        break;
                    case 'product_reviews':
                        dbFunc.getAllReviews(function (err, result) {
                            if (err) {
                                res.send(err)
                            } else {
                                res.status(200).send(result)
                            }
                        })
                        break;
                    default:
                        res.sendStatus(500)
                }
            }
        })
    } else {
        res.sendStatus(401)
    }
})


//endpoint 14
app.delete('/users/delete/:id', verifyToken, function (req, res) {
    let userid = req.params.id
    let type = req.type
    if (type == 'admin') {
        dbFunc.deleteUser(userid, function (err, result) {
            if (err) {
                res.sendStatus(err)
            } else {
                dbFunc.getAllUsers(function (err, result) {
                    if (err) {
                        res.status(500).send('Unable to retrieve all users. Server Error.')
                    } else {
                        res.status(200).send(result) //specific user deleted. success code 200 passed
                    }
                })
            }
        })
    } else {
        res.sendStatus(401)
    }

})


//endpoint 15
app.get('/product', function (req, res) {
    dbFunc.getAllProducts(function (err, result) {
        if (err) {
            res.sendStatus(err)
        } else {
            res.status(200).send(result)
        }
    })
})


//endpoint 16
app.get('/category/:id', function (req, res) {
    let id = req.params.id
    dbFunc.getAllProductsWithinCategory(id, function (err, result) {
        if (err) {
            res.sendStatus(err)
        } else {
            res.status(200).send(result)
        }
    })
})

//endpoint 17
app.get('/products/reviews', function (req, res) {
    dbFunc.getAllReviews(function (err, result) {
        if (err) {
            res.send(err)
        } else {
            res.status(200).send(result)
        }
    })
})

app.post('/search', function (req, res) {
    let string = req.body.string
    dbFunc.searchString(string, function (err, result) {
        if (err) {
            res.send(err)
        } else {
            res.send(result)
        }
    })
})

app.get('/promo/:code', function (req, res) {
    let promo_code = req.params.code
    dbFunc.promoCheck(promo_code, function (err, result) {
        if (err) {
            res.send(err)
        } else {
            res.send(result)
        }
    })
})

app.post('/order', verifyToken, function (req, res) {
    let userid_bill = req.body.userid_bill
    let firstname = req.body.firstname
    let lastname = req.body.lastname
    let contact = req.body.contact
    let email = req.body.email
    let address = req.body.address
    let postcode = req.body.postcode
    let order_amount = req.body.order_amount
    dbFunc.addBill(userid_bill, firstname, lastname, contact, email, address, postcode, order_amount, function (err, result) {
        if (err) {
            res.send(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/order/:billing_id', verifyToken, function (req, res) {
    let billing_id = req.params.billing_id
    dbFunc.checkBill(billing_id, function (err, result) {
        if (err) {
            res.send(err)
        } else {
            res.status(200).send(result)
        }
    })
})

app.post('/news/:userid', function (req, res) {
    let userid = req.params.userid
    let email = req.body.email
    dbFunc.addNewsletter(userid, email, function (err, result) {
        if (err) {
            res.send(err)
        } else {
            res.status(200).send(result)
        }
    })
})

module.exports = app

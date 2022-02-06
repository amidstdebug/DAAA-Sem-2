// p2112646
// Justin Wong Juin Hng
// DAAA/1B/04

let db = require('./databaseConfig.js');
let FileReader = require('filereader')
const config=require('../config.js');
const jwt=require('jsonwebtoken');
const crypto = require('crypto')



function log(data){ //captures all logs and logs them to SQL table console_logs for maintenance purposes
    let conn = db.getConnection()
    conn.connect(function(err){
        if (err){
            log('Console Log Error.')
        }else{
            let sqlquery = 'INSERT INTO console_logs(Log_Description) VALUES(?)'
            conn.query(sqlquery,data);
            conn.end();
        }
    })
    console.log(data)
}

let userDB = {
    // Retrieve Specific User Data by GET method
    getUser: function (id,callback){
        let conn = db.getConnection();
        conn.connect(function(err){
            if (err){
                log('\ngetUser: Error. Could not connect to SQL Server.\n'+err); //internal sql error. error code 500 passed
                return callback(500,null)
            }
            else{
                if (isNaN(id)){
                    log(`\ngetUser: Not connected to SQL Server: Invalid ID (${id})\n`+err); //check if id entered in a number
                    return callback(400, null)
                }
                let sqlquery = 'SELECT * FROM userinfo WHERE userid = ?' //retrieve specific user info
                conn.query(sqlquery, [id], function (err,result){
                    conn.end();
                    if (err){
                        log('\ngetUser: Internal Server Error.\n'+err) //internal sql error. error code 500 passed
                        return callback(500,null);
                    }else{
                        if (result[0] === undefined){
                            log(`getUser: Connected to SQL Server: User ${id} not found.`); //user not found, 404 error code passed
                            return callback(404,null)
                        }
                        else{
                            log(`getUser: Connected to SQL Server: Printing User ${id}`); //successful connection. user info retrieved
                            return callback(null,result[0])
                        }
                    }
                })


            }
        })
    },
     userLogin: function (email,password, callback) {
        let conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {

                console.log(email,password)
                let sql = 'SELECT * FROM userinfo WHERE email=? and password=?';
                conn.query(sql, [email, password], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        if (result.length==0){
                            return callback(404,null)
                        }
                        else{
                        let token="";
                        token=jwt.sign
                        (
                    {
                                userid:result[0].userid,
                                type:result[0].type
                            },
                            config.key,
                    {
                                expiresIn:86400,//expires in 24 hrs
                                algorithm: 'HS256'
                            }
                        );
                        result ={
                            'token':token,
                        }
                        console.log(`Token: ${token}`)
                        return callback(null,result);
                        }
                    }
                });
            }
        })
    },

    //Retrieve All Data within 'userinfo' Table by GET method
    getAllUsers : function (type,callback){
        let conn = db.getConnection();
        conn.connect(function (err){
            if (err){
                log('\ngetAllUsers : Error. Could not connect to SQL Server.\n'+err); //check for sql connection
                return callback(500,null)
            }else{
                if (type=='admin'){
                    let sqlquery = 'SELECT * FROM userinfo' //retrieve all users
                    conn.query(sqlquery, function(err,result){
                    conn.end();
                        if (err){
                            log('\ngetAllUsers : Internal Server Error.\n'+err) //internal sql error. error code 500 passed
                            return callback(500,null)
                        }else{
                            log(`getAllUsers : Connected to SQL Server: Printing All Users.`) //successful connection. all users printed
                            return callback(null,result)
                        }
                    })
                }
                else{
                    console.log(`getAllUsers : Not Connected to SQL Server: Unauthorised Access as ${type}.`)
                    return callback(401,null)
                }

            }
        })

    },

    //Add user to userinfo table by POST method
    addUser : function(username,email,contact,password,type,profile_pic_url,callback){
        let conn = db.getConnection();
        conn.connect(function(err){
            if (err){
                log('\naddUser : Error. Could not connect to SQL Server.\n'+err) //check for sql connection
                return callback(500,null)
            }else{
                if(isNaN(contact)){
                log('\naddUser : Bad Request. Input received does not match required datatype.')
                return callback(400,null)
                }
                if(type=='customer'|| type=='admin'){
                    let sqlquery = 'INSERT INTO userinfo(username,email,contact,password,type, profile_pic_url) VALUES(?,?,?,?,?,?)'; //create new user
                    conn.query(sqlquery, [username, email,contact, password, type, profile_pic_url], function (err){
                        conn.end()
                        if (err){
                            if (err.errno===1062){
                                log('\naddUser : Duplicate Entry. The new username OR new email provided already exists.\n'+err); //duplicate users. 422 error code passed
                                return callback(422,null)
                            }
                            else{
                            log('\naddUser : Internal Server Error\n'+err) //internal sql error. error code 500 passed
                            return callback(500,null)
                            }
                        }else{
                            let conn = db.getConnection()
                            conn.connect(function(err){
                                if (err) {
                                    log('\naddUser : Error. Could not connect to SQL Server.\n' + err) //check for sql connection
                                    return callback(500, null)
                                }else{
                                    let sqlquery = `SELECT userid FROM userinfo where username=?`
                                    conn.query(sqlquery,[username],function(err,result){
                                    if(err){
                                        log(err)
                                        return callback(err,null)
                                    }
                                    else {
                                        let string_id = JSON.stringify(result[0].userid)
                                        log(`addUser : Connected to SQL Server: Added User ID: ${string_id}`) //successful connection. user added
                                        let hash = password
                                        let sqlquery = `UPDATE userinfo SET password = ? WHERE userid =?`
                                        conn.query(sqlquery,[hash,string_id],function(err,result){
                                            conn.end()
                                                if (err){
                                                    log(err)
                                                    return callback(err,null)
                                                }else{
                                                    return callback(null,`User ID: ${string_id}`)
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }else{
                    log('\naddUser : Bad Request. Input received mismatches required datatype.')
                    return callback(400,null)
                }

            }
        })
    },
    //Inserts new user info into existing entries within userinfo database using PUT method
    editUser : function(id, username,email,contact,password,type,profile_pic_url,arr,type1,callback){
        let conn = db.getConnection();
        conn.connect(function(err){
            if (err){
                log('\neditUser : Error. Could not connect to SQL Server.\n'+err) //check for sql connection
                return callback(500,null)
            }
            else{
                if (type1=='admin'){
                    if(isNaN(contact)){
                    log('\neditUser : Bad Request. Input received mismatches required datatype.')
                    return callback(400,null)
                    }
                    if(type=='customer'|| type=='admin'|| type==''){
                        let sqlquery = 'SELECT * FROM userinfo WHERE userid = ?'
                        conn.query(sqlquery, [id], function (err,result){
                            if (err){
                                log('\neditUser : Internal Server Error.\n'+err) //internal sql error. error code 500 passed
                                return callback(500,null);
                            } else{
                                if (result[0] === undefined){
                                    log(`editUser : Connected to SQL Server: User ${id} not found.`); //404 error code passed. user not found
                                    return callback(404,null)
                                }
                                else{
                                    if(((result[0].username)==username||(result[0].email)==email)){ //check for duplicate information
                                        log('\neditUser : Duplicate Entry. The new username OR new email provided already exists.'); //422 error code. duplicate entries found
                                        return callback(422,null)
                                    }
                                    else{
                                        let sqlquery = 'SELECT * FROM userinfo WHERE userid= ?'
                                        conn.query(sqlquery,id,function(err,result){
                                            if (err){
                                                log('\neditUser : Internal Server Error\n'+err) //internal sql error. error code 500 passed
                                                return callback(500, null)
                                            }else{
                                                let values = Object.values(result[0])
                                                let dump = values.shift()
                                                for(let i = 0; i<arr.length; i++){
                                                    if(arr[i]==''){
                                                        arr[i] = values[i+1]
                                                    }
                                                    else if(arr[i]==values[i+1]){
                                                        return callback(422,null)
                                                    }
                                                }

                                                console.log('\nFull User Info =>\n',arr)
                                                let username = arr[0]
                                                let sqlquery = `UPDATE userinfo SET username=?,email=?,contact=?,password=?,type=?,profile_pic_url=? WHERE userid=?` //update user info
                                                conn.query(sqlquery, [arr[0],arr[1],arr[2],arr[3],arr[4]],id,function(err,result){
                                                    if (err) {
                                                        if (err.errno === 1062) { //check if duplicate error
                                                            log('\neditUser : Duplicate Entry. The new username OR new email provided already exists.\n'+err); //duplicate error found. 422 error code passed
                                                            return callback(422, null)
                                                        } else {
                                                            log('\neditUser : Internal Server Error\n'+err) //internal sql error. error code 500 passed
                                                            return callback(500, null)
                                                        }
                                                    } else{
                                                        let sqlquery = `SELECT userid FROM userinfo where username=?`
                                                        conn.query(sqlquery,[username],function(err,result){
                                                            if(err){
                                                                log(err)
                                                                return callback(err,null)
                                                            }
                                                            else {
                                                                let string_id = JSON.stringify(result[0].userid)
                                                                let hash = password
                                                                let sqlquery = `UPDATE userinfo SET password = ? WHERE userid =?`
                                                                conn.query(sqlquery,[hash,string_id],function(err,result){
                                                                conn.end()
                                                                    if (err){
                                                                        log(err)
                                                                        return callback(err,null)
                                                                    }else{
                                                                        log(`\neditUser : Edited User ID: ${string_id}`)
                                                                        return callback(null,null)
                                                                    }
                                                                })
                                                            }
                                                        })//user edit successful.
                                                    }
                                                })
                                            }
                                        })
                                    }
                                }
                            }
                        })
                    }else{
                        log('\neditUser : Bad Request. Input received mismatches required datatype.')
                        return callback(400,null)
                    }
                }
                else{
                    return callback(401,null)
                }

            }
        })
    },
    //delete specific user
    deleteUser : function(id,callback){
        let conn = db.getConnection();
        conn.connect(function(err){
            if (err){
                log('\ndeleteUser : Error. Could not connect to SQL Server.\n'+err) //check for sql connection
                return callback(500,null)
            }else{
                if (isNaN(id)){
                    log(`\ndeleteUser : Not connected to SQL Server: Invalid ID (${id})\n`+err); //check if id entered in a number
                    return callback(400, null)
                }
                let sqlquery = 'SELECT * FROM userinfo WHERE userid = ?' //sql query
                conn.query(sqlquery, [id], function (err,result){
                    if (err){
                        log('\ndeleteUser : Internal Server Error.\n'+err) //internal sql error. error code 500 passed.
                        return callback(500,null);
                    } else{
                        if (result[0] === undefined){
                            log(`deleteUser : Connected to SQL Server: User ${id} not found.`); //user not found. 404 error code passed
                            return callback(404,null)
                        }
                        else{
                            let sqlquery = 'DELETE FROM userinfo WHERE userid = ?' //sql query to delete user
                            conn.query(sqlquery, [id], function(err, result){
                                conn.end();
                                if (err){
                                    log('\ndeleteUser : Internal Server Error.\n'+err) //internal sql error. error code 500 passed
                                    return callback(500,null)
                                }else{
                                    log(`deleteUser : Connected to SQL Server: User ${id} deleted.`)
                                    return callback(null,result) // user deleted successfully.
                                }
                            })
                        }
                    }
                })
            }
        })
    },
    addCategory : function(category, description, type,callback){
        let conn = db.getConnection();
        conn.connect(function(err){
            if (err){
                log('\naddCategory: Internal Server Error\n'+err)
                return callback(500,null)
            }else {
                if(type=='admin'){
                    if (isNaN(description)) {
                    let sqlquery = 'INSERT INTO product_categories (category, description) VALUES (?,?)'
                    conn.query(sqlquery, [category, description], function (err, result) {
                        if (err) {
                            if (err.errno === 1062) { //check if duplicate error
                                log('\naddCategory : Duplicate Entry. The new username OR new email provided already exists.\n'+err); //duplicate error found. 422 error code passed
                                return callback(422, null)
                            } else {
                                log('\naddCategory : Internal Server Error\n'+err) //internal sql error. error code 500 passed
                                return callback(500, null)
                            }
                        } else {
                            log('addCategory : Product Category Added.')
                            return callback(null, result)
                        }
                    })
                    }else{
                        log('\naddCategory : Bad Request. Input received mismatches required datatype.')
                        return callback(400, null)
                        }
                }else{
                    return callback(401,null)
                }
            }
        })
    },
    getAllCategories : function(callback){
        let conn = db.getConnection()
        conn.connect(function(err){
            if(err){
                log('\getAllCategories : Internal Server Error\n'+err)
                return callback(500,null)
            }else{
                let sqlquery = 'SELECT * FROM product_categories'
                conn.query(sqlquery,function(err,result){
                    if(err){
                        log('\ngetAllCategories : Internal Server Error.\n'+err) //internal sql error. error code 500 passed
                        return callback(500,null)
                    }else{
                        log('\ngetAllCategories : Connected to SQL Server. Printing All Product Categories')
                        return callback(null,result)
                    }
                })
            }
        })
    },
    addProduct : function(name,description,category_id,brand,price,img_src,category_name,callback){
        let conn = db.getConnection();
        conn.connect(function(err){
            if (err){
                log('\naddProduct : Error. Could not connect to SQL Server.\n'+err) //check for sql connection
                return callback(500,null)
            }else{
                if(isNaN(category_id)){
                log('\naddProduct : Bad Request. Input received does not match required datatype.')
                return callback(400,null)
                }
                if(!isNaN(price)){
                    let sqlquery = 'INSERT INTO products(name, description, category_id, brand, price,product_image_src,category_name) VALUES(?,?,?,?,?,?,?)'; //create new user
                    conn.query(sqlquery, [name, description, category_id, brand, price,img_src,category_name], function (err){

                        if (err){
                            if (err.errno===1062){
                                log('\naddProduct : Duplicate Entry. The new name provided already exists.\n'+err); //duplicate users. 422 error code passed
                                return callback(422,null)
                            }
                            else{
                            log('\naddProduct : Internal Server Error\n'+err) //internal sql error. error code 500 passed
                            return callback(500,null)
                            }
                        }else{
                            let conn = db.getConnection()
                            conn.connect(function(err){
                                if (err) {
                                    log('\naddProduct : Error. Could not connect to SQL Server.\n' + err) //check for sql connection
                                    return callback(500, null)
                                }else{
                                    let sqlquery = `SELECT product_id FROM products WHERE name=?`
                                    conn.query(sqlquery,[name],function(err,result){
                                    conn.end()
                                    if(err){
                                        log(err)
                                        return callback(err,null)
                                    }
                                    else {
                                        let string_id = JSON.stringify(result[0].product_id)
                                        log(`\naddProduct : Connected to SQL Server: Added Product ID: ${string_id}`) //successful connection. user added
                                        return callback(null, result)
                                        }
                                    })
                                }
                            })

                        }
                    })
                }else{
                    log('\naddUser : Bad Request. Input received mismatches required datatype.')
                    return callback(400,null)
                }

            }
        })
    },
    getAllProducts : function(callback){
        let conn = db.getConnection();
        conn.connect(function (err){
            if (err){
                log('\ngetAllProducts : Error. Could not connect to SQL Server.\n'+err); //check for sql connection
                return callback(500,null)
            }else{
                let sqlquery = 'SELECT * FROM products' //retrieve all users
                conn.query(sqlquery, function(err,result){
                    conn.end();
                    if (err){
                        log('\ngetAllProducts : Internal Server Error.\n'+err) //internal sql error. error code 500 passed
                        return callback(500,null)
                    }else{
                        log(`getAllProducts : Connected to SQL Server: Printing All Products.`) //successful connection. all users printed
                        return callback(null,result)
                    }
                })
            }
        })
    },
    getAllProductsWithinCategory : function(id,callback){
        let conn = db.getConnection()
        conn.connect(function(err){
            if(err){
                log('\ngetAllProductsWithinCategory : Error. Could not connect to SQL Server.\n'+err)
                return callback(500,null)
            }else{
                if(!isNaN(id)){
                    let sqlquery1 = 'CREATE TEMPORARY TABLE temp_products AS SELECT * FROM products;'
                    conn.query(sqlquery1,[id],function(err){
                        if (err){
                            log('\ngetAllProductsWithinCategory : Internal Server Error.\n'+err) //internal sql error. error code 500 passed
                        }else{
                            let sqlquery2 = 'SELECT category_id,product_id,name,description,price,brand,product_image_src FROM temp_products WHERE category_id=?'
                            conn.query(sqlquery2,[id],function(err,result){
                                conn.end()
                                if(err){
                                    log('\ngetAllProductsWithinCategory : Internal Server Error.\n'+err) //internal sql error. error code 500 passed
                                    return callback(500,null)
                                }else {
                                    if (result === undefined) {
                                        log(`\ngetAllProductsWithinCategory : Bad Request. Product Category ${id} not found.`)
                                        return callback(400, null)
                                    } else {
                                        log(`ngetAllProductsWithinCategory : Connected to SQL Server: Category ${id}'s Information.`) //successful connection. all users printed
                                        console.log(result)
                                        return callback(null, result)
                                    }
                                }
                            })

                        }
                    })
                }else{
                    log('\ngetAllProductsWithinCategory : Bad Request. Input received mismatches required datatype.')
                    return callback(400,null)
                }
            }
        })
    },
    getProduct : function(id,callback){
        let conn = db.getConnection()
        conn.connect(function(err){
            if(err){
                log('\ngetProduct : Error. Could not connect to SQL Server.\n'+err)
                return callback(500,null)
            }else{
                if(!isNaN(id)){
                    let sqlquery1 = 'CREATE TEMPORARY TABLE temp_table AS SELECT products.name, products.description, products.category_id,products.price,products.product_id,products.brand,products.product_image_src,products.category_name,product_categories.category FROM products INNER JOIN product_categories ON products.category_id=product_categories.category_id'
                    conn.query(sqlquery1,[id],function(err){
                        if (err){
                            log('\ngetProduct : Internal Server Error.\n'+err) //internal sql error. error code 500 passed
                            return callback(500,null)
                        }else{
                            let sqlquery2 = 'SELECT name,description,category_id,category,brand,price,product_image_src,category_name FROM temp_table WHERE product_id=?'
                            conn.query(sqlquery2,[id],function(err,result){
                                conn.end()
                                if (err){
                                    log('\ngetProduct : Internal Server Error.\n'+err) //internal sql error. error code 500 passed
                                    return callback(500,null)
                                }else{
                                     if(result[0]===undefined){
                                        log(`\ngetProduct : Bad Request. Product ${id} not found.`)
                                        return callback(404,null)
                                    }else{
                                         result[0].price = result[0].price.toFixed(2)
                                         log(`\ngetProduct : Connected to SQL Server: Product ${id}'s Information.`) //successful connection. all users printed
                                         return callback(null,result)
                                     }
                                }
                            })
                        }
                    })
                }else{
                    log('\ngetProduct : Bad Request. Input received mismatches required datatype.')
                    return callback(400,null)
                }
            }
        })
    },
    deleteProduct: function (id,callback){
        let conn = db.getConnection();
        conn.connect(function(err){
            if (err){
                log('\ndeleteProduct: Error. Could not connect to SQL Server.\n'+err); //internal sql error. error code 500 passed
                return callback(500,null)
            }
            else{
                if (isNaN(id)){
                    log(`\ndeleteProduct: Not connected to SQL Server: Invalid ID (${id})\n`+err); //check if id entered in a number
                    return callback(400, null)
                }
                let sqlquery = 'DELETE FROM products where product_id=?' //retrieve specific user info
                conn.query(sqlquery, [id], function (err,result){
                    conn.end();
                    if (err){
                        log('\ndeleteProduct: Internal Server Error.\n'+err) //internal sql error. error code 500 passed
                        return callback(500,null);
                    }else{
                        log(`deleteProduct: Connected to SQL Server: Deleting Product ${id}`); //successful connection. user info retrieved
                        return callback(null,result[0])

                    }
                })


            }
        })
    },
    addReview : function(userid,product_id,rating,review,callback){
        let conn = db.getConnection();
        conn.connect(function(err){
            if (err){
                console.log('\naddReview : Error. Could not connect to SQL Server.\n'+err) //check for sql connection
                return callback(500,null)
            }else{
                if(isNaN(userid)||isNaN(product_id)||isNaN(rating)||(rating<1)||(rating>5)){
                    console.log(userid, product_id, rating)
                    console.log('\naddReview : Bad Request. Input received does not match required datatype.')
                    return callback(400,null)
                    }
                if(isNaN(review)){
                    let sqlquery =`SELECT reviewid FROM product_reviews WHERE userid=? AND productid=? AND rating=? AND review=?`
                    conn.query(sqlquery,[userid,product_id,rating,review],function(err,result){
                        if(err){
                            console.log(err)
                            return callback(500,null)
                        }else if (result.length<1){
                            let sqlquery = 'INSERT INTO product_reviews(userid, productid, rating, review) VALUES(?,?,?,?)'; //create new user
                            conn.query(sqlquery, [userid,product_id,rating,review], function (err){
                                conn.end()
                                if (err){
                                    if (err.errno===1062){
                                        console.log('\naddReview : Duplicate Entry. The provided input already exists.\n'+err); //duplicate users. 422 error code passed
                                        return callback(422,null)
                                    }
                                    else{
                                    console.log('\naddReview : Internal Server Error\n'+err) //internal sql error. error code 500 passed
                                    return callback(500,null)
                                    }
                                }else{
                                    let conn = db.getConnection()
                                    conn.connect(function(err){
                                        if (err) {
                                            console.log('\naddReview : Error. Could not connect to SQL Server.\n' + err) //check for sql connection
                                            return callback(500, null)
                                        }else{
                                            let sqlquery = `SELECT reviewid FROM product_reviews WHERE userid=? AND productid=? AND rating=? AND review=?`
                                            conn.query(sqlquery,[userid,product_id,rating,review],function(err,result){
                                            conn.end()
                                            if(err){
                                                console.log(err)
                                                return callback(err,null)
                                            }
                                            else {
                                                let string_id = JSON.stringify(result[0].reviewid)
                                                console.log(`\naddReview : Connected to SQL Server: Added Product ID: ${string_id}`) //successful connection. user added
                                                return callback(null, result)
                                                }
                                            })
                                        }
                                    })

                                }
                            })
                        }else{
                            console.log(result)
                            log('\naddReview : Duplicate Entry. The provided input already exists.\n')
                            return callback (422,null)
                        }
                    })

                }else{
                    console.log('\naddReview : Bad Request. Input received mismatches required datatype.')
                    return callback(400,null)
                }

            }
        })
    },
    getSpecificReview : function (productid,callback){
        let conn = db.getConnection();
        conn.connect(function(err){
            if (err){
                log('\ngetSpecificReview: Error. Could not connect to SQL Server.\n'+err); //internal sql error. error code 500 passed
                return callback(500,null)
            }
            else{
                if (isNaN(productid)){
                    log(`\ngetSpecificReview: Not connected to SQL Server: Invalid ID (${productid})\n`+err); //check if reviewid entered in a number
                    return callback(400, null)
                }
                let sqlquery = 'SELECT productid, product_reviews.userid, username,rating,review,product_reviews.created_at FROM product_reviews JOIN userinfo on product_reviews.userid = userinfo.userid WHERE productid = ?' //retrieve specific user info
                conn.query(sqlquery, [productid], function (err,result){
                    conn.end();
                    if (err){
                        log('\ngetSpecificReview: Internal Server Error.\n'+err) //internal sql error. error code 500 passed
                        return callback(500,null);
                    }else{
                        if (result[0] === undefined){
                            log(`\ngetSpecificReview: Connected to SQL Server: Product ${productid} not found.`); //user not found, 404 error code passed
                            return callback(404,null)
                        }
                        else{
                            log(`\ngetSpecificReview: Connected to SQL Server: Printing Review for Product ${productid}`); //successful connection. user info retrieved
                            return callback(null,result)
                        }
                    }
                })
            }
        })
    },
    createInterest : function (id,categoryids,callback){
        let conn = db.getConnection();
        let valueCheck = 0
        let errorCheck = 0
        conn.connect(function(err){
            if (err){
                log('\createInterest: Error. Could not connect to SQL Server.\n'+err); //internal sql error. error code 500 passed
                return callback(500,null)
            }
            else{
                if (isNaN(id)){
                    log(`\createInterest: Not connected to SQL Server: Invalid ID (${id})\n`+err); //check if id entered in a number
                    return callback(400, null)
                }
                let sqlquery = `DELETE FROM userinfo_product_categories_junction WHERE user_id =?;`
                conn.query(sqlquery,[id],function(err){
                    if(err){
                         log('\createInterest: Internal Server Error.\n'+err)
                         return callback(500,null)
                    }else{

                        if(categoryids[0]!=''){
                            for (let i=0; i<categoryids.length;i++){
                                let sqlquery = 'INSERT INTO `bed_assignment2`.`userinfo_product_categories_junction` (`user_id`, `category_id`) VALUES (?,?);' //retrieve specific user info
                                conn.query(sqlquery, [id,categoryids[i]], function (err){
                                if (err){
                                    errorCheck++
                                    log('\createInterest: Internal Server Error.\n'+err)//internal sql error. error code 500 passed
                                    if (errorCheck==categoryids.length){
                                        return callback(500,null);
                                    }
                                }else{
                                    valueCheck++
                                    log(`\createInterest: Connected to SQL Server: Added Interests For User ${id} @ Category ${categoryids[i]}`); //successful connection. user info retrieved
                                    if (valueCheck==categoryids.length){
                                        return callback (null,201)
                                    }
                                }

                                })
                            }
                        }else{
                            return callback(null,201)
                        }
                    }
                })


            }
        })
    },
    getAllReviews : function (callback){
        let conn = db.getConnection();
        conn.connect(function(err){
            if (err){
                log('\ngetAllReviews: Error. Could not connect to SQL Server.\n'+err); //internal sql error. error code 500 passed
                return callback(500,null)
            }
            else{
                let sqlquery = 'SELECT * FROM product_reviews' //retrieve specific user info
                conn.query(sqlquery, function (err,result){
                    conn.end();
                    if (err){
                        log('\ngetAllReviews: Internal Server Error.\n'+err) //internal sql error. error code 500 passed
                        return callback(500,null);
                    }else{
                        log(`\ngetAllReviews: Connected to SQL Server: Printing Table`); //successful connection. user info retrieved
                        return callback(null,result)
                    }
                })
            }
        })
    },
    searchString :function(string,callback){
        var resultsArray = []
        var search_string;
        let conn=db.getConnection()
        conn.connect(function(err){
            if (err){
                log(err)
                return callback(500,null)
            }else{
                let arrayCounter = 0
                let array_string = string.split(' ')
                console.log(array_string)
                if (array_string.length>1){
                    search_string = array_string.filter((v, i, a) => a.indexOf(v) === i);

                }else {
                    search_string = array_string
                }
                for (let i=0;i<search_string.length;i++){
                    let sqlquery=
                        `
                            SELECT product_id,name,description,brand,price,product_image_src FROM bed_assignment2.products WHERE description LIKE ? AND category_name LIKE ? OR name LIKE ? OR brand LIKE ? 
                        `
                    conn.query(sqlquery,[`%${search_string[i]}%`,`%${search_string[i]}%`,`%${search_string[i]}%`,`%${search_string[i]}%`],function(err,result){
                        if (err){
                            log(err)
                            return callback(500,null)
                        }else if(arrayCounter!=search_string.length){
                            arrayCounter++
                            resultsArray.push(
                                result
                            )
                            if(arrayCounter==search_string.length){
                                log(`Searching for string ${search_string[i]}`)
                                arrayCounter = 0
                                console.log(resultsArray)
                                return callback (null,resultsArray)
                        }

                        }

                    })
                }

            }

        })
    },
    categoryCheck : function (id,callback){
        let conn = db.getConnection();
        conn.connect(function(err){
            if (err){
                log('\nccategoryCheck: Error. Could not connect to SQL Server.\n'+err); //internal sql error. error code 500 passed
                return callback(500,null)
            }
            else{
                if (isNaN(id)){
                    log(`\ncategoryCheck: Not connected to SQL Server: Invalid ID (${id})\n`+err); //check if id entered in a number
                    return callback(400, null)
                }
                let sqlquery = `SELECT category FROM product_categories WHERE category_id = ?;` //retrieve specific user info
                    conn.query(sqlquery, [id], function (err,result){
                    if (err){
                        log('\ncategoryCheck: Internal Server Error.\n'+err)//internal sql error. error code 500 passed
                        return callback(500,null);
                    }else{
                        log(`\nccategoryCheck: Connected to SQL Server: Checked Category for Category ID ${id}`); //successful connection. user info retrieved
                        return callback (null,result)
                    }

                })


            }
        })
    },
    promoCheck : function (code,callback){
        let conn = db.getConnection();
        conn.connect(function(err){
            if (err){
                log('\npromoCheck: Error. Could not connect to SQL Server.\n'+err); //internal sql error. error code 500 passed
                return callback(500,null)
            }
            else{
                let sqlquery = `SELECT promo_amount FROM promotion WHERE promo_code = ?;` //retrieve specific user info
                    conn.query(sqlquery, [code], function (err,result){
                    if (err){
                        log('\npromoCheck: Internal Server Error.\n'+err)//internal sql error. error code 500 passed
                        return callback(500,null);
                    }else{
                        if (result.length==0){
                            log(`\npromoCheck: Connected to SQL Server: Promo Code '${code}' does not exist!`); //successful connection. user info retrieved
                            return callback(404,null)
                        }else{
                            log(`\npromoCheck: Connected to SQL Server: Checked Promotion Details for Code '${code}'`); //successful connection. user info retrieved
                            return callback (null,result)
                        }
                    }

                })


            }
        })
    },
    addBill : function (userid,first,last,contact,email,address,postcode,order_amount,callback){
        let conn = db.getConnection();
        conn.connect(function(err){
            if (err){
                console.log('\npromoCheck: Error. Could not connect to SQL Server.\n'+err); //internal sql error. error code 500 passed
                return callback(500,null)
            }
            else{
                console.log(order_amount)
                let sqlquery = `INSERT INTO billing_info(userid_bill,firstname,lastname, contact, email,address, postcode, order_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`
                    conn.query(sqlquery, [userid,first,last,contact,email,address,postcode,order_amount], function (err,result){
                    if (err){
                        console.log('\naddBill: Internal Server Error.\n'+err)//internal sql error. error code 500 passed
                        return callback(500,null);
                    }else{
                        let sqlquery = 'SELECT billing_id FROM billing_info WHERE userid_bill=? AND firstname=? AND lastname=? AND contact=? AND email=? AND address=? AND postcode=? AND order_amount=?'
                        conn.query(sqlquery,[userid,first,last,contact,email,address,postcode,order_amount],function(err,result){
                            conn.end()
                            if (err){
                                console.log(err)
                                return callback(500,null)
                            }else{
                                console.log(result[0].billing_id)
                                console.log(`\naddBill: Connected to SQL Server:Added Order ID '${result[0].billing_id}'`); //successful connection. user info retrieved
                                return callback (null,result[0])
                            }
                        })
                    }

                })


            }
        })
    },
     checkBill : function (billing_id,callback){
        let conn = db.getConnection();
        conn.connect(function(err){
            if (err){
                console.log('\ncheckBill: Error. Could not connect to SQL Server.\n'+err); //internal sql error. error code 500 passed
                return callback(500,null)
            }
            else{
                let sqlquery = `SELECT * FROM billing_info WHERE billing_id =?`
                    conn.query(sqlquery, [billing_id], function (err,result){
                    if (err){
                        console.log('\ncheckBill: Internal Server Error.\n'+err)//internal sql error. error code 500 passed
                        return callback(500,null);
                    }else{
                        console.log(result[0])
                        console.log(`\ncheckBill: Connected to SQL Server:Printing Order ID '${billing_id}'`); //successful connection. user info retrieved
                        return callback (null,result[0])
                        }
                    })
                }
            })
    },
    checkInterest: function (id,callback){
        let conn = db.getConnection();
        conn.connect(function(err){
            if (err){
                log('\ncheckInterest: Error. Could not connect to SQL Server.\n'+err); //internal sql error. error code 500 passed
                return callback(500,null)
            }
            else{
                if (isNaN(id)){
                    log(`\ncheckInterest: Not connected to SQL Server: Invalid ID (${id})\n`+err); //check if id entered in a number
                    return callback(400, null)
                }
                let sqlquery = 'SELECT category_id FROM userinfo_product_categories_junction WHERE user_id = ?' //retrieve specific user info
                conn.query(sqlquery, [id], function (err,result){
                    conn.end();
                    if (err){
                        log('\ncheckInterest: Internal Server Error.\n'+err) //internal sql error. error code 500 passed
                        return callback(500,null);
                    }else{
                        if (result === undefined){
                            log(`\ncheckInterest: Connected to SQL Server: User ${id} not found.`); //user not found, 404 error code passed
                            return callback(404,null)
                        }
                        else{
                            log(`\ncheckInterest: Connected to SQL Server: Printing User ${id}`); //successful connection. user info retrieved
                            return callback(null,result)
                        }
                    }
                })


            }
        })
    },
    addNewsletter: function (id,email,callback){
        let conn = db.getConnection();
        conn.connect(function(err){
            if (err){
                log('\naddNewsletter: Error. Could not connect to SQL Server.\n'+err); //internal sql error. error code 500 passed
                return callback(500,null)
            }
            else{
                if (isNaN(id)){
                    log(`\naddNewsletter: Not connected to SQL Server: Invalid ID (${id})\n`+err); //check if id entered in a number
                    return callback(400, null)
                }
                let sqlquery = 'INSERT INTO newsletter (`user_id`,`email`) VALUES (?,?)' //retrieve specific user info
                conn.query(sqlquery, [id,email], function (err,result){
                    conn.end();
                    if (err){
                        log('\naddNewsletter: Internal Server Error.\n'+err) //internal sql error. error code 500 passed
                        return callback(422,null);
                    }else{
                        log(`\naddNewsletter: Connected to SQL Server: Added Newsletter for User ${id}`); //successful connection. user info retrieved
                        return callback(null,result)
                    }
                })


            }
        })
    },
    editProduct : function(id, category_id,name,description,brand,price,product_image_src,category_name,arr,type1,callback){
        let conn = db.getConnection();
        conn.connect(function(err){
            if (err){
                log('\neditUser : Error. Could not connect to SQL Server.\n'+err) //check for sql connection
                return callback(500,null)
            }
            else{
                if (type1=='admin'){
                    if(isNaN(category_id)){
                    log('\neditUser : Bad Request. Input received mismatches required datatype.')
                    return callback(400,null)
                    }
                    if(type1=='customer'|| type1=='admin'|| type==''){
                        let sqlquery = 'SELECT * FROM products WHERE product_id = ?'
                        conn.query(sqlquery, [id], function (err,result){
                            if (err){
                                log('\neditUser : Internal Server Error.\n'+err) //internal sql error. error code 500 passed
                                return callback(500,null);
                            } else{
                                if (result[0] === undefined){
                                    log(`editUser : Connected to SQL Server: Product ${id} not found.`); //404 error code passed. user not found
                                    return callback(404,null)
                                }
                                else{
                                    if(((result[0].name)==name)){ //check for duplicate information
                                        log('\neditUser : Duplicate Entry. The new name provided already exists.'); //422 error code. duplicate entries found
                                        return callback(422,null)
                                    }
                                    else{
                                        let sqlquery = 'SELECT * FROM products WHERE product_id= ?'
                                        conn.query(sqlquery,id,function(err,result){
                                            if (err){
                                                log('\neditUser : Internal Server Error\n'+err) //internal sql error. error code 500 passed
                                                return callback(500, null)
                                            }else{
                                                let values = Object.values(result[0])
                                                let dump = values.shift()
                                                for(let i = 0; i<arr.length; i++){
                                                    if(arr[i]==''){
                                                        arr[i] = values[i+1]
                                                    }
                                                    else if(arr[i]==values[i+1]){
                                                        return callback(422,null)
                                                    }
                                                }

                                                console.log('\nFull Product Info =>\n',arr)
                                                let sqlquery = `UPDATE products SET category_id=?,name=?,description=?,brand=?,price=?,product_image_src=?,category_name=? WHERE product_id=?` //update user info
                                                conn.query(sqlquery, [arr[1],arr[2],arr[3],arr[4],arr[5],arr[6],arr[7],arr[0]],function(err,result){
                                                    conn.end();
                                                    if (err) {
                                                        if (err.errno === 1062) { //check if duplicate error
                                                            log('\neditUser : Duplicate Entry. The new username OR new email provided already exists.\n'+err); //duplicate error found. 422 error code passed
                                                            return callback(422, null)
                                                        } else {
                                                            console.log('\neditUser : Internal Server Error\n'+err) //internal sql error. error code 500 passed
                                                            return callback(500, null)
                                                        }
                                                    } else{
                                                        log(`\neditUser : Edited Product ID: ${id}`)
                                                        return callback(null,201)
                                                    }
                                                })
                                            }
                                        })
                                    }
                                }
                            }
                        })
                    }else{
                        log('\neditUser : Bad Request. Input received mismatches required datatype.')
                        return callback(400,null)
                    }
                }
                else{
                    return callback(401,null)
                }

            }
        })
    }


}
module.exports = userDB


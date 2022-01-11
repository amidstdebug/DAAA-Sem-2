let db = require('./databaseConfig.js');

let userDB = {
    getUser: function (userid,callback){
        let conn = db.getConnection();
        conn.connect(function(err){
            if (err){
                console.log(err);
                return callback(err,null)
            }
            else{
                if (isNaN(userid)){
                    console.log(`Not connected to SQL Server: Invalid ID (${userid})`);
                    return callback(400, null)
                }
                let sqlquery = 'SELECT * FROM userinfo WHERE userid = ?'
                conn.query(sqlquery, [userid], function (err,result){
                    conn.end();
                    if (err){
                        return callback(err,null);
                    }else{
                        if (result[0] === undefined){
                            console.log(`Connected to SQL Server: User ${userid} not found.`);
                            return callback(404,null)
                        }
                        else{
                            console.log(`Connected to SQL Server: Printing User ${userid}`);
                            return callback(null,result[0])
                        }
                    }
                })


            }
        })
    },
    getAllUsers : function (callback){
        let conn = db.getConnection();
        conn.connect(function (err){
            if (err){
                console.log(err)
                return callback(err,null)
            }else{

                let sqlquery = 'SELECT * FROM userinfo'
                conn.query(sqlquery, function(err,result){
                    conn.end();
                    if (err){
                        console.log(err)
                        return callback(err,null)
                    }else{
                        console.log(`Connected to SQL Server: Printing All Users.`)
                        return callback(null,result)
                    }
                })
            }
        })

    },
    addUser : function(username, email, role, password, callback){
        let conn = db.getConnection();
        conn.connect(function(err){
            if (err){
                console.log(err);
                return callback(err,null)
            }else{
                let sqlquery = 'INSERT INTO userinfo(username,email,role,password) VALUES(?,?,?,?)';
                conn.query(sqlquery, [username, email, role, password], function (err, result){
                    conn.end();
                    if (err){
                        console.log(err);
                        return callback(err,null)
                    }else{
                        console.log(result.affectedRows)
                        console.log(`Connected to SQL Server: Adding User(s).`)
                        return callback(null, result.affectedRows)
                    }
                })
            }
        })
    },
    editUser : function(userid, username, email,role,password, callback){
        let conn = db.getConnection();
        conn.connect(function(err){
            if (err){
                console.log(err)
                return callback(err,null)
            }
            else{
                let sqlquery = `UPDATE userinfo SET username='${username}',email='${email}',role='${role}',password='${password}' WHERE userid=${userid}`
                conn.query(sqlquery, function(err,result){
                conn.end();
                if (err){
                    console.log(err)
                    return callback(err,null)
                }else{
                    return callback(null,result)
                }
                })
            }
        })
    }
}

module.exports = userDB
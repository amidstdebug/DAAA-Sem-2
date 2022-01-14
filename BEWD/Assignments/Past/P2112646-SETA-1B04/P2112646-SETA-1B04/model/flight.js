// p2112646
// Justin Wong Juin Hng
// DAAA/1B/04



var db=require('./databaseConfig');

let userDB = {
    // Retrieve Specific User Data by METHOD method
    updateFlight : function (flightID,price,callback){
        let conn = db.getConnection();
        conn.connect(function(err){
            if (err){
                console.log('\addFlight: Error. Could not connect to SQL Server.\n'+err); //internal sql error. error code 500 passed
                return callback(500,null)
            }
            else{
                if (isNaN(flightID)){
                    console.log(`\addFlight: Not connected to SQL Server: Invalid ID (${flightID})\n`+err); //check if flightID entered in a number
                    return callback(400, null)
                }
                let sqlquery2 = `SELECT * FROM flight where flightid=${flightID}` //retrieve specific user info
                conn.query(sqlquery2, function (err,result){
                    if (err){
                        console.log('\addFlight: Internal Server Error.\n'+err) //internal sql error. error code 500 passed
                        return callback(500,null);
                    }else{
                        if (result[0] === undefined){
                            console.log(`\addFlight: Connected to SQL Server: Flight ${flightID} not found.`); //user not found, 404 error code passed
                            return callback(404,null)
                        }
                        else{
                            let sqlquery2 = `UPDATE flight SET price=${price} WHERE flightid=${flightID}`
                            conn.query(sqlquery2,[price],function(err,result){
                                if(err){
                                    console.log('\addFlight: Internal Server Error.\n'+err)
                                    return callback(500,null)
                                }else{
                                    console.log(`\addFlight: Connected to SQL Server: Updating Flight ${flightID}`); //successful connection. user info retrieved
                                    return callback(null,result)
                                }
                            })

                        }
                    }
                })
            }
        })
    },
    addFlight : function (flightCode,departAirportId,arrivalAirportId,departTime,duration,price,callback){
        let conn = db.getConnection();
        conn.connect(function(err){
            if (err){
                console.log('\naddFlight: Error. Could not connect to SQL Server.\n'+err); //internal sql error. error code 500 passed
                return callback(500,null)
            }
            else{
                if (isNaN(departAirportId)||isNaN(arrivalAirportId)){
                    console.log(`\naddFlight: Not connected to SQL Server: Invalid departAirportId (${departAirportId}) or arrivalAirportId (${arrivalAirportId})\n`+err); //check if flightID entered in a number
                    return callback(400, null)
                }
                let sqlquery1 = `SELECT * FROM flight WHERE flightcode = ?`
                conn.query(sqlquery1,flightCode,function(err,result){
                    if (err){
                        console.log('\naddFlight: Internal Server Error.\n'+err) //internal sql error. error code 500 passed
                        return callback(500,null);
                    }
                    else{
                        if (result[0] === undefined){
                            let sqlquery2 = `INSERT INTO flight(flightCode,departAirportId,arrivalAirportId,departTime,duration,price) VALUES(?,?,?,?,?,?)` //retrieve specific user info
                            conn.query(sqlquery2,[flightCode,departAirportId,arrivalAirportId,departTime,duration,price], function (err){
                            if (err){
                                console.log('\naddFlight: Internal Server Error.\n'+err) //internal sql error. error code 500 passed
                                return callback(500,null);
                            }else{
                                let sqlquery3 = `SELECT flightid,insertiondate FROM flight WHERE flightcode=?`
                                conn.query(sqlquery3,[flightCode],function(err,result){
                                    conn.end()
                                    if(err){
                                        console.log('\naddFlight: Internal Server Error.\n'+err)
                                        return callback(500,null)
                                    }else{
                                        console.log(`\naddFlight: Connected to SQL Server: Printing New Flight ${flightCode}`); //successful connection. user info retrieved
                                            return callback(null,result)
                                        }
                                    })
                                }
                            })
                        }
                        else{
                            console.log('Flight Exists')
                            return callback(500,null)
                        }
                    }
                })

            }
        })
    },

}
module.exports = userDB
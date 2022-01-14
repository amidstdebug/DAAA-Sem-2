// p2112646
// Justin Wong Juin Hng
// DAAA/1B/04



const db=require('./databaseConfig')

let userDB = {
    // Retrieve Specific User Data by METHOD method
    getCountry : function (country,callback){
        let conn = db.getConnection();
        conn.connect(function(err){
            if (err){
                console.log('\ngetCountry: Error. Could not connect to SQL Server.\n'+err); //internal sql error. error code 500 passed
                return callback(500,null)
            }
            else{
                if (!isNaN(country)){
                    console.log(`\ngetCountry: Not connected to SQL Server: Invalid Country: (${country})\n`+err); //check if country entered in a number
                    return callback(400, null)
                }
                let sqlquery = 'SELECT name,country,city,description FROM sp_air.airport WHERE country = ?' //retrieve specific user info
                conn.query(sqlquery, [country], function (err,result){
                    conn.end();
                    if (err){
                        console.log('\ngetCountry: Internal Server Error.\n'+err) //internal sql error. error code 500 passed
                        return callback(500,null);
                    }else{
                        if (result[0] === undefined){
                            console.log(`\ngetCountry: Connected to SQL Server: ${country} not found.`); //user not found, 404 error code passed
                            return callback(404,null)
                        }
                        else{
                            console.log(`\ngetCountry: Connected to SQL Server: Printing ${result}`); //successful connection. user info retrieved
                            return callback(null,result)
                        }
                    }
                })
            }
        })
    },
        // Retrieve Specific User Data by METHOD method
        cheapestFlight : function (fromAirportId,toAirportId,callback){
            let conn = db.getConnection();
            conn.connect(function(err){
                if (err){
                    console.log('\ncheapestFlight: Error. Could not connect to SQL Server.\n'+err); //internal sql error. error code 500 passed
                    return callback(500,null)
                }
                else{
                    if (isNaN(fromAirportId)||isNaN(toAirportId)){
                        console.log(`\ncheapestFlight: Not connected to SQL Server: Invalid ID (${fromAirportId})\n`+err); //check if fromAirportId entered in a number
                        return callback(400, null)
                    }
                        let sqlquery1 = `CREATE TEMPORARY TABLE temp_flight_info AS SELECT flightcode, price,departAirportId,arrivalAirportId,name FROM flight,airport WHERE departAirportId = ? AND arrivalAirportId=? AND id =?;
` //retrieve specific user info
                        conn.query(sqlquery1, [fromAirportId,toAirportId,fromAirportId], function (err,result){
                            if (err){
                            console.log('\ncheapestFlight: Internal Server Error.\n'+err) //internal sql error. error code 500 passed
                            return callback(500,null);
                        }else{
                            let sqlquery2 = `ALTER TABLE temp_flight_info RENAME COLUMN name TO departAirport;`
                            conn.query(sqlquery2,function(err){
                                if(err){
                                    console.log('\ncheapestFlight: Internal Server Error.\n'+err) //internal sql error. error code 500 passed
                                    return callback(500,null);
                                }else{
                                    let sqlquery3 = 'ALTER TABLE temp_flight_info ADD arrivalAirport VARCHAR(255);'
                                    conn.query(sqlquery3,function(err){
                                        if (err){
                                             console.log('\ncheapestFlight: Internal Server Error.\n'+err) //internal sql error. error code 500 passed
                                            return callback(500,null);
                                        }else{
                                            let sqlquery4 = `SELECT name from airport where id=?`
                                            conn.query(sqlquery4, [toAirportId],function(err,result){
                                                if (err){
                                                    console.log('\ncheapestFlight: Internal Server Error.\n'+err) //internal sql error. error code 500 passed
                                                    return callback(500,null);
                                                }else{
                                                    let sqlquery5 = `SELECT * FROM temp_flight_info`
                                                    conn.query(sqlquery5,[toAirportId],function(err,result){
                                                        conn.end()
                                                        if(err){
                                                            console.log('\ncheapestFlight: Internal Server Error??.\n'+err) //internal sql error. error code 500 passed
                                                            return callback(500,null);
                                                        }else{
                                                            console.log(`\ncheapestFlight: Connected to SQL Server: Printing`); //successful connection. user info retrieved
                                                            return callback(null,result)
                                                        }
                                                    })

                                                }
                                            })

                                        }

                                    })

                                }
                            })

                        }
                    })
                }
            })
        },


}
module.exports = userDB
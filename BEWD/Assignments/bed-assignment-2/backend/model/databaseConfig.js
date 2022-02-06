// p2112646
// Justin Wong Juin Hng
// DAAA/1B/04

let mysql = require('mysql');
 let dbConnect = {
     getConnection : function(){
         let conn = mysql.createConnection({
             host: 'localhost',
             user:'root',
             password: 'laxcrumb529ladbutterfly!',
             database:'bed_assignment2',
             dateStrings:true,
             multipleStatements: true
             }

         )
         return conn;
     }
 }

 module.exports = dbConnect
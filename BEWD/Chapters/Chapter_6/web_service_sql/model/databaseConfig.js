var mysql = require('mysql');

var dbconnect = {
    getConnection : function (){
        let conn = mysql.createConnection(
            {
                host:'localhost',
                user:'root',
                password:'laxcrumb529ladbutterfly!',
                database:'furniture'
            }
        )
        return conn;
    }
};

module.exports = dbconnect




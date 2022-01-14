// p2112646
// Justin Wong Juin Hng
// DAAA/1B/04



var mysql=require('mysql');

var dbConnect={

    getConnection:function(){
        var conn=mysql.createConnection({
            host:"localhost",
            user:"root",
            password:"laxcrumb529ladbutterfly!",
            database:"sp_air"

        }

        );

        return conn;

    }
}
module.exports=dbConnect;
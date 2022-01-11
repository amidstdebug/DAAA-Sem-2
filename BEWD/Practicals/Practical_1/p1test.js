const fs = require('fs');
fs.readFile('./file.txt', 'utf-8', function(err,data){
        if (err!==null){
            console.log(err);
        }
        else{
            console.log(data);
        }
    }
);


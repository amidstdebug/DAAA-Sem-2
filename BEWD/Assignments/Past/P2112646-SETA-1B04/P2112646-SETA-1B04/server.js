// p2112646
// Justin Wong Juin Hng
// DAAA/1B/04



var app=require('./controller/app');

var port=8081;

var server=app.listen(port,function(){

    console.log("Web App hosted http://localhost:%s",port);
});
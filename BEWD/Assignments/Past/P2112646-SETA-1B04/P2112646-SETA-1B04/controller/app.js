// p2112646
// Justin Wong Juin Hng
// DAAA/1B/04



var express=require('express');
var app=express();
var airportFunc = require('../model/airport.js')
var flightFunc = require('../model/flight')
var bodyParser=require('body-parser');
var urlencodedParser=bodyParser.urlencoded({extended:false});

app.use(bodyParser.json()); //parse appilcation/json data
app.use(urlencodedParser);

app.get('/airport/:country', function(req,res){
    let country = req.params.country
    airportFunc.getCountry(country,function(err,result){
        if(err){
            res.send('{"Message":"Some error occurred"}')
        }else{
            res.status(200).send(result)
        }
    })
})
app.put('/flight/:flightID', function(req,res){
    let flightID = req.params.flightID
    let price = req.body.price
    flightFunc.updateFlight(flightID,price,function(err,result){
        if(err){
            if(err === 404){
            res.status(err).send('{"Message":"No Such Flight Exists"}')
            }else{
                res.status(500).send('{"Message":"Update Unsuccessful!"}')
            }

        }else{
            res.status(200).send('{"Message":"Success"}')
        }
    })
})

app.post('/flight', function(req,res){
    let flightCode = req.body.flightCode
    let departAirportId = req.body.departAirportId
    let arrivalAirportId = req.body.arrivalAirportId
    let departTime = req.body.departTime
    let duration = req.body.duration
    let price = req.body.price
    flightFunc.addFlight(flightCode,departAirportId,arrivalAirportId,departTime,duration,price,function(err,result){
        if(err){
            res.send('{"Message":"Insertion Failed"}')
        }else{
            res.status(200).send(result)
        }
    })
})

app.get('/top3CheapestFlights/:fromAirportId/:toAirportId', function(req,res){
    let fromAirportId = req.params.fromAirportId
    let toAirportId = req.params.toAirportId
    airportFunc.cheapestFlight(fromAirportId,toAirportId,function(err,result){
        if(err){
            res.send('{"Message":"Some error occurred"}')
        }else{
            res.status(200).send(result)
        }
    })
})

module.exports=app;


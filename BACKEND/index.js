var express= require("express");
var cors= require("cors");
var bodyParser=require("body-parser");
var Influx=require("influx");
var mqtt= require("mqtt");
var client= mqtt.connect("mqtt://test.mosquitto.org");


let carApp=express();
carApp.use(cors());
carApp.use(bodyParser.json());
const influx=new Influx.InfluxDB({
    host: "localhost",
    database: "cars",
    schema:[
        {
            measurement: "filters",
            fields:
            {
                temperature: Influx.FieldType.FLOAT,
                longitude: Influx.FieldType.FLOAT,
                latitude: Influx.FieldType.FLOAT,
                direction: Influx.FieldType.FLOAT,
                speed: Influx.FieldType.FLOAT
            },
            tags: ["carId"]
        }
    ]
});

client.on("connect", function()
{
    client.subscribe("cars/+");
});

client.on("message", function(topic, json){
    console.log(topic.toString());
    console.log(json.toString());
    var message=JSON.parse(json);
    influx.writePoints(
        [{
            measurement: "filters",
            fields:
            {
                temperature: message.temperature,
                longitude: message.position.longitude,
                latitude: message.position.latitude,
                direction: message.direction,
                speed: message.speed
            },
            tags:
            {
                carId: message.carId
            }
        }]
    )
        .then(result =>
        {
            console.log("inviato");
        })
        .catch(error =>
        {
            console.log(
                "temperature: " + message.temperature+
                " longitude: " + message.position.longitude+
                " latitude: " + message.position.latitude+
                " direction: " + message.direction+
                " speed: " + message.speed);

            console.error("Error : "+error.toString());

        });
});


carApp.get("/", (req,res)=>
{
    res.status(200).send(
        console.dir({"name": "ciccio"}));
});

carApp.get("/databases", (req,res)=>{
   influx.getDatabaseNames()
       .then(names => res.status(200).json(names));
});

carApp.get("/query", (req,res)=>{
    influx.query(`select temperature, longitude, latitude, direction, speed from cars.autogen.filters`)
        .then(result=>res.status(200).json(result));
});

carApp.post("/", (req,res)=>{
    influx.writePoints(
        [{
            measurement: "filters",
            fields: {
                temperature: req.body.temperature,
                longitude: req.body.position.longitude,
                latitude: req.body.position.latitude,
                direction: req.body.direction,
                speed: req.body.speed
            },
            tags: {
                carId: req.body.carId
            }
        }]
    )
        .then(result => {
            res.status(200).send("inviato");
            console.log("inviato");
        })
        .catch(error => {
            console.error("Error : "+error.toString());
        });
    /*console.log(
        "temperature: "+req.body.temperature+
        " longitude: "+req.body.position.longitude+
        " latitude: "+req.body.position.latitude+
        " direction: "+req.body.direction+
        " speed: "+req.body.speed);
    res.status(200).send("Messaggio ricevuto");*/
});

carApp.listen(5000, () => {
    console.log("In ascolto sulla porta 5000");
});
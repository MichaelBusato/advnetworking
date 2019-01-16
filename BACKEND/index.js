var express= require("express");
var cors= require("cors");
var bodyParser=require("body-parser");
var Influx=require("influx");


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
                longitude: Influx.FieldType.STRING,
                latitude: Influx.FieldType.STRING,
                direction: Influx.FieldType.FLOAT,
                speed: Influx.FieldType.FLOAT
            },
            tags: ["carId"]
        }
    ]
});



carApp.get("/", (req,res)=>
{
    influx
        .query(`SELECT * FROM "cars"."autogen"."filters"`)
        .then(result=>res.status(200).json(result));
});

carApp.post("/", (req,res)=>{
    influx
        .writePoints
    (
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
        .then(() => {
            res.status(200).send();
            console.log("inviato");
        })
        .catch(error => {
            console.error("Error : "+error.toString());
        });
});

carApp.listen(5000, () => {
    console.log("In ascolto sulla porta 5000");
});
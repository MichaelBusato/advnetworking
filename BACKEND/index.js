var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var Influx = require("influx");
var mqtt = require("mqtt");
var client = mqtt.connect("mqtt://test.mosquitto.org");


let carApp = express();
carApp.use(cors());
carApp.use(bodyParser.json());
const influx = new Influx.InfluxDB({
   host: "localhost",
   database: "cars",
   schema: [
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

client.on("connect", function () {
   client.subscribe("cars/+");
   console.log('Connesso al topic: cars/+');
});

client.on("message", function (topic, json) {
   console.log(topic.toString());
   console.log(json.toString());
   var message = JSON.parse(json);
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
      .then(() => {
         console.log("inviato");
      })
      .catch(error => {
         console.log(
            "temperature: " + message.temperature +
            " longitude: " + message.position.longitude +
            " latitude: " + message.position.latitude +
            " direction: " + message.direction +
            " speed: " + message.speed);

         console.error("Error : " + error.toString());

      });
});
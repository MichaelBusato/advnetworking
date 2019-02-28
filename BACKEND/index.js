let amqp = require('amqplib/callback_api');
let Influx = require('influx');
let connString = 'amqp://bbzfgvml:oJ2xRSnm6qrODxX3VbzkDVBn0Y0XYckZ@sheep.rmq.cloudamqp.com/bbzfgvml';
let express = require("express");
let cors = require("cors");
let bodyParser = require("body-parser");

let carApi = express();
carApi.use(cors());
carApi.use(bodyParser.json());


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

amqp.connect(connString, function (err, conn) {
   conn.createChannel(function (err, ch) {
      const topic = 'cars';

      ch.assertQueue(topic, { durable: false });
      console.log("Server in ascolto sul topic: ", topic);
      ch.consume(topic, function (msg) {
         console.log("Ricevuto messaggio: %s", msg.content.toString());

         let message = JSON.parse(msg.content);
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

      }, { noAck: true });
   });
});
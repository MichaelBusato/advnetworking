var express= require("express");
var cors= require("cors");
var bodyParser=require("body-parser");
var Influx=require("influx");

let carApp=express();
carApp.use(cors());
carApp.use(bodyParser.json());
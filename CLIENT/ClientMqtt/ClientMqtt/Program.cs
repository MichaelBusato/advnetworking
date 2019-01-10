using System;
using System.Collections.Generic;
using Client.Sensors;
using System.Net;
using System.IO;
using System.Collections;
using MQTTnet;
using MQTTnet.Client;

namespace Client
{
    class Program
    {
        static void Main(string[] args)
        {

            //// init sensors
            //List<SensorInterface> sensors = new List<SensorInterface>();
            //sensors.Add(new VirtualTemperatureSensor());
            //sensors.Add(new VirtualPositionSensor());

            //while (true)
            //{
            //    foreach (SensorInterface sensor in sensors)
            //    {
            //        HttpWebRequest httpWebRequest = (HttpWebRequest)WebRequest.Create("http://192.168.101.84:5000/");
            //        //httpWebRequest.ContentType = "text/json";
            //        httpWebRequest.ContentType = "application/json";
            //        httpWebRequest.Method = "POST";

            //        using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
            //        {
            //            streamWriter.Write(sensor.toJson());
            //        }

            //        var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
            //        var responseString = new StreamReader(httpResponse.GetResponseStream()).ReadToEnd();

            //        Console.WriteLine(responseString);

            //        Console.Out.WriteLine(httpResponse.StatusCode);

            //        System.Threading.Thread.Sleep(1000);


            List<SensorInterface> sensors = new List<SensorInterface>();
            sensors.Add(new VirtualTemperatureSensor());
            sensors.Add(new VirtualPositionSensor());

            var factory = new MqttFactory();
            var mqttClient = factory.CreateMqttClient();
            var options = new MqttClientOptionsBuilder()
                        .WithTcpServer("test.mosquitto.org")
                        .Build();

            //await mqttClient.ConnectAsync(options);                    
            mqttClient.ConnectAsync(options).Wait();
            while (true)
            {
                foreach (SensorInterface sensor in sensors)
                {
                    var message = new MqttApplicationMessageBuilder()
                        .WithTopic("cars/ciccio")
                        .WithPayload(sensor.toJson())
                        .Build();

                    //await mqttClient.PublishAsync(message);
                    mqttClient.PublishAsync(message).Wait();                    

                    Console.Out.WriteLine("inviato");

                    System.Threading.Thread.Sleep(1000);
                }

    }

        }

    }

}

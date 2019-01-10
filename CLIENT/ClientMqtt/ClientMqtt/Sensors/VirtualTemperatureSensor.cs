using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Client.Sensors
{
    class VirtualTemperatureSensor : TemperatureSensorInterface, SensorInterface
    {
        public void setTemperature(int temperature)
        { }

        public int getTemperature()
        {
            Random random = new Random();
            return ((int)random.Next(10, 500) / 10);
        }

        public string toJson()
        {
            return "{\"temperature\":\"" + getTemperature() + "\"}";
        }
    }
}

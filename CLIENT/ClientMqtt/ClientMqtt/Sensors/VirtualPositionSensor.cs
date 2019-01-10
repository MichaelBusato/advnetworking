using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Globalization;

namespace Client.Sensors
{
    class VirtualPositionSensor : PositionSensorInterface, SensorInterface
    {
        public void setPosition(decimal lat, decimal lon)
        { }

        public (decimal, decimal) getPosition()
        {
            NumberFormatInfo nfi = new NumberFormatInfo();
            nfi.NumberDecimalSeparator = ".";

            Random random = new Random();
            return (new decimal((double)random.Next(10, 500) / 10), new decimal((double)random.Next(10, 500) / 10));
        }

        public string toJson()
        {
            (decimal, decimal) position = getPosition();
            return "{\"position\": {\"latitude\": " + position.Item1 + ", \"longitude\": " + position.Item2 + "}}";
        }
    }
}

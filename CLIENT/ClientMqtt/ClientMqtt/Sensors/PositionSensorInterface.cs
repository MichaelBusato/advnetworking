using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Client.Sensors
{
    interface PositionSensorInterface
    {
        void setPosition(decimal lat, decimal lon);
        (decimal, decimal) getPosition();
    }
}

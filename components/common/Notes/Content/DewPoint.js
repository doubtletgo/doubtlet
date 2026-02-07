export default {
  title: 'Notes: Dew Point Calculator',
  description: [
    {
      value: `How to use this calculator`,
      type: 'h4',
    },
    {
      value: `This calculator will help you to find the Dew Point in degree Celsius. In the both input boxes, 
      we have to put the values of Dry Bulb & Relative Humidity. Then after clicking the <b>Calculate</b> button 
      a step-by-step solution will be displayed on the screen.`,
      type: 'span',
    },
    {
      value: `What is Dew Point?`,
      type: 'h5',
    },
    {
      value: `Dew point is defined as the temperature at which a given volume of air at a certain atmospheric pressure 
      is saturated with water vapor, causing condensation and the formation of dew.`,
      type: 'span',
    },
    {
      type: 'br',
    },
    {
      value: `Dew is the condensed water that is often visible on plant leaves and grass early in the morning. 
      It varies depending on the amount of water vapor present in the air, with more humid air resulting in a higher 
      dew point than dry air.`,
      type: 'span',
    },
    {
      type: 'br',
    },
    {
      value: `Furthermore, the higher the relative humidity, the closer the dew point to the current air temperature, 
      with 100% relative humidity meaning that dew point is equivalent to the current temperature. In cases where the 
      dew point is below freezing (0°C or 32°F), the water vapor turns directly into frost rather than dew.`,
      type: 'span',
    },
    {
      type: 'br',
    },
    {
      value: `While perception varies between people, and people on some level can acclimatize to higher dew points, 
      higher dew points are generally uncomfortable because the humidity inhibits proper evaporation of sweat, making 
      it more difficult for a person's body to cool down. Conversely, lower dew points can also be uncomfortable, 
      causing skin irritation and cracking, as well as drying out a person's airways. The US Occupational Safety and 
      Health Administration recommends that indoor air temperatures be maintained between 68-76°F with a relative 
      humidity of 20-60%.`,
      type: 'span',
    },
    {
      type: 'br',
    },
    {
      value: `Dew point is also considered in general aviation to calculate the probability of potential issues such as 
      carburettor icing as well as fog. In some cases, devices known as dew point meters are used to measure dew point 
      over a wide range of temperatures. These devices consist of a polished metal mirror that is cooled as air is 
      passed over it. The temperature at which dew forms on the mirror is the dew point.`,
      type: 'span',
    },
    {
      value: `Formula used:`,
      type: 'h5',
    },
    {
      value: `N = {\\bigg \\lbrace{ln{(RH)\\above{1pt}(100)}+{17.27*DB\\above{1pt}237.3+DB}}\\bigg \\rbrace\\above{1pt}(17.27)}`,
      type: 'equation',
    },

    {
      value: `DP = \\bigg({237.3*N\\above{1pt}1-N}\\bigg)`,
      type: 'equation',
    },
    {
      value: `Where,`,
      type: 'span',
    },
    {
      type: 'br',
    },
    {
      value: `DB = Dry Bulb Temperature (In Degree Celsius)<br>
      RH = Relative Humidity<br>
      DP = Dew Point (In Degree Celsius)<br>`,
      type: 'span',
    },
  ],
};

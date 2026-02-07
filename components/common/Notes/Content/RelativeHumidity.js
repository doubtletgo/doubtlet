export default {
  title: "Notes: Relative Humidity Calculator",
  description: [
    {
      value: `How to use this calculator`,
      type: "h4",
    },
    {
      value: `This calculator will help you to find the Relative humidity in %. In the both input boxes, 
      we have to put the values of Dry Bulb & Wet Bulb. Then after clicking the <b>Calculate</b> button a step-by-step 
      solution will be displayed on the screen.`,
      type: "span"
    },
    {
      value: `What is Relative humidity?`,
      type: "h5"
    },
    {
      value: `Humidity is defined as the amount of water vapor i.e. (gaseous phase of water) in the air. The maximum 
      water vapor can hold by air is affected by temperature; the higher the temperature, the greater the amount of 
      water vapor it can hold before reach saturation. It is an indicator of the presence of dew, frost, fog, and 
      precipitation in the atmosphere.`,
      type: "span"
    },
    {
      type: "br"
    },
    {
      value: `Humidity is often discussed in terms of absolute humidity and relative humidity.`,
      type: "span"
    },
    {
      type: "br"
    },
    {
      value: `<b>Absolute humidity</b>, is the measurement of the water content in the air, typically in units of grams per 
      cubic meter. It is calculated by dividing the total mass of water vapor by the volume of the air. Given the 
      same amount of water vapor in the air, the absolute humidity does not change with the temperature at a fixed volume. 
      If the volume is not fixed, as in the atmosphere, absolute humidity changes in response to the volume changes caused 
      by the temperature and pressure variation`,
      type: "span"
    },
    {
      type: "br"
    },
    {
      value: `<b>Relative humidity</b>, compares the current ratio of absolute humidity to the maximum humidity for a 
      given temperature and expresses this value as a percentage. The higher the percentage, the higher the humidity. 
      It is affected by both temperature and pressure. Given the same amount of water vapor, there will be a higher 
      relative humidity in cool air than there is in warmer air.`,
      type: "span"
    },
    {
      type: "br"
    },
    {
      value: `Relative humidity is a commonly used metric in weather reports and forecasts and is a good indicator of 
      precipitation, dew, frost, fog, and apparent temperature. Apparent temperature is the temperature perceived by 
      humans. In summer, the higher the relative humidity, the higher the apparent temperature. This is a result of a 
      higher humidity reducing the rate at which sweat evaporates, which increases the perceived temperature.`,
      type: "span"
    },
    {
      type: "br"
    },
    {
      value: `Basic Concept: `,
      type: "h5"
    },
    {
      value: `Relative Humidity is measured using a device called Sling Psychrometer. This device consists of two 
      sideways thermometers called Dry Bulb & Wet Bulb thermometer has a wetted wick placed at the bottom. When it 
      is swung around by its attached handle, the air causes the water on the wick to evaporate which in result 
      produces a lower temperature in wet bulb thermometer.`,
      type: "span"
    },
    {
      type: "br"
    },
    {
      value: `But here we can calculate the Relative Humidity without this device by putting the values of Dry 
      Bulb & Wet Bulb in the formula.`,
      type: "span"
    },
    {
      type: "br"
    },
    {
      value: `Equation of formula is so complex that for ease we have been split it into 3 parts.`,
      type: "span"
    },
    {
      value: "Formula used:",
      type: "h5"
    },
    {
      value: `E_d = \\bigg\\lbrace{6.112*e^{\\large17.502*DB\\above{1pt}240.97+DB}}\\bigg\\rbrace \\space \\& \\space
      `,
      type: "equation"
    },
    {
      value: `E_w = \\bigg\\lbrace{6.112*e^{\\large17.502*WB\\above{1pt}240.97+WB}}\\bigg\\rbrace`,
      type: "equation"
    },
    {
      value: `R.H = {(E_w-0.6687451584) *(1+0.00115*WB)*(DB-WB)\\above{1pt}E_d}*100`,
      type: "equation"
    },
    {
      value: `Where,<br> e = 2.71828182845904`,
      type: "span"
    },
    {
      type: 'br'
    },
    {
      value: `DB = Dry Bulb Temperature (In Degree Celsius)<br>
      WB = Wet Bulb Temperature (In Degree Celsius)<br>
      N = 0.6687451584`,
      type: "span"
    }
  ]
}
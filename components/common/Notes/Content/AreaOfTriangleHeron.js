export default {
  title: "Notes: Area Of Triangle",
  description: [
    {
      value: `How to use this calculator`,
      type: "h4",
    },
    {
      value: `This calculator will guide you to obtain the area of triangle by heron’s formula`,
      type: "span"
    },
    "br",
    {
      value: `In the given box we have to put the values of sides of triangle a, b and c in form of fraction, positive real number or 
      any variable and then after clicking on the calculate button, a step-by-step solution will be displayed on the screen.`,
      type: "span"
    },
    {
      value: `What Is Area of the Triangle?`,
      type: "h5"
    },
    {
      value: `The area of a triangle is defined as the total region that is enclosed by the three sides of any particular triangle. 
      Basically, it is equal to half of the base times height, i.e. A = 1/2 × b × h. Hence, to find the area of a tri-sided polygon, 
      we have to know the base (b) and height (h) of it. It is applicable to all types of triangles, whether it is scalene, isosceles 
      or equilateral. To be noted, the base and height of the triangle are perpendicular to each other. The unit of area is measured in 
      square units (m<sup>2</sup>, cm<sup>2</sup>).`,
      type: "span"
    },
    {
      value: `What is Heron's Formula?`,
      type: "h5"
    },
    {
      value: `Heron's formula is used to determine the area of triangles when lengths of all their sides are given or to find the area of 
      quadrilaterals. We also know it as Hero's formula. This formula for finding the area does not depend on the angles of a triangle.
      It solely depends on the lengths of all sides of triangles. It contains the term "s" which is known as semi-perimeter, which is 
      obtained by halving the perimeter of a triangle.`,
      type: "span"
    },
    {
      value: `Heron's Formula Definition:`,
      type: "h5"
    },
    {
      value: `As per Heron's formula, the value of the area of any triangle having lengths, a, b, c, perimeter of the triangle, P, and 
      semi-perimeter of the triangle as 's' is determined using the below-given formula:`,
      type: "span"
    },
    "br",
    {
      value: `Triangle with given side lengths a, b and c , area is given by`,
      type: "span"
    },
    {
      value: `Area \\space of \\space triangle \\space ABC \\space = \\sqrt {s(s-a)(s-b)(s-c)},`,
      type: "equation"
    },
    {
      value: ` where \\space s = {Perimeter \\above{1pt} 2} = {(a + b + c)\\above{1pt}2}`,
      type: "equation"
    },
    {
      src: `/images/notesImages/AreaOfTriangleHeron.png`,
      type: "img",
      alt: "Area Of Triangle Heron Image"
    },
    {
      value: `Important Points on Heron's Formula:`,
      type: "h5"
    },
    {
      value: `Heron's formula is used to find the area of a triangle when all its sides are given.<br>
      We can use heron's formula to find the area of the quadrilateral by dividing it into two triangles.<br>
      The formula uses the semi-perimeter and side of lengths of a triangle.`,
      type: "span"
    },
    {
      value: `Solved Example:`,
      type: "h5"
    },
    {
      value: `<b>Example:</b> Find the area of a triangle whose lengths are 13 units, 14 units, and 15 units respectively.`,
      type: "span"
    },
    "br",
    {
      value: `<b>Solution:</b> As we know, a = 13 units, b = 14 units and c = 15 units`,
      type: "span"
    },
    "br",
    {
      value: `Thus, Semi-perimeter,`,
      type: "span"
    },
    {
      value: `s = {(a + b + c)\\above{1pt}2} = {(13 + 14 + 15)\\above{1pt}2} = 21 units`,
      type: "equation"
    },
    {
      value: `Area \\space of \\space triangle = \\sqrt{(s(s-a)(s-b)(s-c))}`,
      type: "equation"
    },
    {
      value: ` = \\sqrt{(21(21-13)(21-14)(21-15))}`,
      type: "equation"
    },
    {
      value: `\\implies Area \\space of \\space triangle = \\sqrt{(21 × 8 × 7 × 6)} = 84 \\space unit^2`,
      type: "equation"
    },
    {
      value: `∴ The area of the triangle is 84 unit<sup>2</sup> `,
      type: "span"
    },
  ]
}
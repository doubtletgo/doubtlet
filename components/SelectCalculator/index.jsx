'use client';
import { useMemo } from 'react';
import Dropdown from '../dropodown';

const SelectCalculator = () => {
  const calculators = useMemo(
    () => [
      {
        label: 'Math',
        value: 'Math',
        href: '/calculator/math/',
      },
      {
        label: 'Pre Algebra',
        value: 'Pre Algebra',
        href: '/calculator/pre-algebra/',
      },
      {
        label: 'Algebra',
        value: 'Algebra',
        href: '/calculator/algebra/',
      },
      {
        label: 'Pre Calculus',
        value: 'Pre Calculus',
        href: '/calculator/pre-calculus/',
      },
      {
        label: 'Calculus',
        value: 'Calculus',
        href: '/calculator/calculus/',
      },
      {
        label: 'Geometry',
        value: 'Geometry',
        href: '/calculator/geometry/',
      },
      {
        label: 'Linear Algebra',
        value: 'Linear Algebra',
        href: '/calculator/linear-algebra/',
      },
      {
        label: 'Matrix',
        value: 'Matrix',
        href: '/calculator/matrix-operations/',
      },
      {
        label: 'Vector',
        value: 'Vector',
        href: '/calculator/vector-operations/',
      },
      {
        label: 'Complex Numbers',
        value: 'Complex Numbers',
        href: '/calculator/complex-numbers/',
      },
      {
        label: 'Three dimension 3D',
        value: 'Three Dimension 3D',
        href: '/calculator/three-dimension-3d/',
      },
      {
        label: 'Polynomials',
        value: 'Polynomials',
        href: '/calculator/polynomial-operations/',
      },
      {
        label: 'Coordinate Geometry',
        value: 'Coordinate Geometry',
        href: '/calculator/coordinate-geometry/',
      },
      {
        label: 'Cartesian Cylindrical Spherical',
        value: 'Cartesian Cylindrical Spherical',
        href: '/calculator/cartesian-cylindrical-spherical/',
      },
      {
        label: 'Trignometry',
        value: 'Trignometry',
        href: '/calculator/trignometry/',
      },

      {
        label: 'Decimal',
        value: 'Decimal',
        href: '/calculator/decimal-operations/',
      },
      {
        label: 'Fraction',
        value: 'Fraction',
        href: '/calculator/fraction-operations/',
      },
      {
        label: 'Percentage',
        value: 'Percentage',
        href: '/calculator/percentage/',
      },
      {
        label: 'Sequence and Series',
        value: 'Sequence and Series',
        href: '/calculator/sequence-and-series/',
      },
      {
        label: 'Probability and Statistics',
        value: 'Probability and Statistics',
        href: '/calculator/probability-and-statistics/',
      },
      {
        label: 'Finance',
        value: 'Finance',
        href: '/calculator/finance/',
      },
      {
        label: 'Health & Fitness',
        value: 'Health & Fitness',
        href: '/calculator/health-and-fitness/',
      },
      {
        label: 'Other',
        value: 'Other',
        href: '/calculator/other/',
      },
      {
        label: 'Distance between two points',
        value: 'Distance between two points',
        href: '/calculator/distance-between-two-points/',
      },
      {
        label: 'Quadratic Equation',
        value: 'Quadratic equation',
        href: '/calculator/quadratic-equation/',
      },
      {
        label: 'Slope of line',
        value: 'Slope of line',
        href: '/calculator/slope-of-line/',
      },

      {
        label: 'Equation of Line from Two Points',
        value: 'Equation of Line from Two Points',
        href: '/calculator/equation-of-line-from-two-points/',
      },

      {
        label: 'Addition Subtraction of Complex Numbers',
        value: 'Addition Subtraction of Complex Numbers',
        href: '/calculator/addition-subtraction-of-complex-number/',
      },

      {
        label: 'Division of Two Complex Numbers',
        value: 'Division of Two Complex Numbers',
        href: '/calculator/division-of-two-complex-numbers/',
      },
      {
        label: 'Modulus of A Complex Number',
        value: 'Modulus of A Complex Number',
        href: '/calculator/modulus-of-a-complex-number/',
      },
      {
        label: 'Multiplication of Two Complex Numbers',
        value: 'Multiplication of Two Complex Numbers',
        href: '/calculator/multiplication-of-two-complex-numbers/',
      },
      {
        label: 'Ncr',
        value: 'Ncr',
        href: '/calculator/ncr/',
      },
      {
        label: 'Npr',
        value: 'Npr',
        href: '/calculator/npr/',
      },
      {
        label: 'permutation',
        value: 'Permutation',
        href: '/calculator/permutation/',
      },
      {
        label: 'Circular Permutation',
        value: 'Circular Permutation',
        href: '/calculator/circular-permutation-calculator/',
      },

      {
        label: 'Sum Of First N Natural Numbers',
        value: 'Sum Of First N Natural Numbers',
        href: '/calculator/sum-of-first-n-natural-numbers-calculator/',
      },
      {
        label: 'Sum Of Squares Of First N Natural Numbers',
        value: 'Sum Of Squares Of First N Natural Numbers',
        href: '/calculator/sum-of-squares-of-first-n-natural-numbers-calculator/',
      },
      {
        label: 'Sum Of Cubes Of First N Natural Numbers',
        value: 'Sum Of Cubes Of First N Natural Numbers',
        href: '/calculator/sum-of-cubes-of-first-n-natural-numbers-calculator/',
      },
      {
        label: 'Sum Of First N Terms Of A.P By First And Last Term',
        value: 'Sum Of First N Terms Of A.P By First And Last Term',
        href: '/calculator/sum-of-arithmetic-progression-calculator-by-first-and-last-term-calculator/',
      },
      {
        label: 'Sum Of First N Terms Of A.P',
        value: 'Sum Of First N Terms Of A.P',
        href: '/calculator/arithmetic-progression-calculator/',
      },
      {
        label: 'Sum Of Infinite Terms Of G.P',
        value: 'Sum Of Infinite Terms Of G.P',
        href: '/calculator/sum-of-infinite-geometric-series-calculator/',
      },
      {
        label: 'Sum Of First N Terms Of G.P',
        value: 'Sum Of First N Terms Of G.P',
        href: '/calculator/geometric-progression-calculator/',
      },
      {
        label: (
          <span>
            N<sup>th</sup> Term Of A.P
          </span>
        ),
        value: 'Nth Term Of A.P',
        href: '/calculator/nth-term-of-arithmetic-sequence-calculator/',
      },
      {
        label: (
          <span>
            N<sup>th</sup> Term Of G.P
          </span>
        ),
        value: 'Nth Term Of G.P',
        href: '/calculator/nth-term-of-geometric-sequence-calculator/',
      },
      {
        label: (
          <span>
            N<sup>th</sup> Term Of H.P
          </span>
        ),
        value: 'Nth Term Of H.P',
        href: '/calculator/nth-term-of-harmonic-progression-calculator/',
      },
      {
        label: 'Arithmetic Mean(Average)',
        value: 'Arithmetic Mean(Average)',
        href: '/calculator/arithmetic-mean-calculator/',
      },
      {
        label: 'Geometric Mean',
        value: 'Geometric Mean',
        href: '/calculator/geometric-mean-calculator/',
      },
      {
        label: "Area Of Triangle (Heron's)",
        value: "Area Of Triangle (Heron's)",
        href: '/calculator/heron-triangle-area-calculator/',
      },
      {
        label: 'Area Of Equilateral Triangle',
        value: 'Area Of Equilateral Triangle',
        href: '/calculator/area-of-equilateral-triangle-calculator/',
      },
      {
        label: 'Area Of Trapezium ',
        value: 'Area Of Trapezium ',
        href: '/calculator/area-of-trapezoid-calculator/',
      },
      {
        label: 'Area Of Circle ',
        value: 'Area Of Circle ',
        href: '/calculator/circle-area-calculator/',
      },
      {
        label: 'Area Of Ellipse ',
        value: 'Area Of Ellipse ',
        href: '/calculator/ellipse-area-calculator/',
      },
      {
        label: 'Area Of Triangle ',
        value: 'Area Of Triangle ',
        href: '/calculator/triangle-area-calculator/',
      },
      {
        label: 'Area Of Parallelogram',
        value: 'Area Of Parallelogram ',
        href: '/calculator/parallelogram-area-calculator/',
      },
      {
        label: 'Area Of Rhombus ',
        value: 'Area Of Rhombus ',
        href: '/calculator/area-of-rhombus-calculator/',
      },
      {
        label: 'Area Of Regular Pentagon ',
        value: 'Area Of Regular Pentagon ',
        href: '/calculator/area-of-regular-pentagon-calculator/',
      },
      {
        label: 'Volume Of Sphere',
        value: 'Volume Of Sphere',
        href: '/calculator/sphere-volume-calculator/',
      },
      {
        label: 'Volume Of Hemisphere',
        value: 'Volume Of Hemisphere',
        href: '/calculator/hemisphere-volume-calculator/',
      },
      {
        label: 'Total Surface Area Of Sphere',
        value: 'Total Surface Area Of Sphere',
        href: '/calculator/surface-area-of-sphere-calculator/',
      },
      {
        label: 'Total Surface Area Of Hemisphere',
        value: 'Total Surface Area Of Hemisphere',
        href: '/calculator/surface-area-of-hemisphere-calculator/',
      },
      {
        label: 'Surface Area Of Cuboid ',
        value: 'Surface Area Of Cuboid ',
        href: '/calculator/surface-area-of-cuboid-calculator/',
      },
      {
        label: 'Surface Area Of Cube ',
        value: 'Surface Area Of Cube ',
        href: '/calculator/surface-area-of-cube-calculator/',
      },
      {
        label: 'Volume Of Cone',
        value: 'Volume Of Cone',
        href: '/calculator/cone-volume-calculator/',
      },
      {
        label: 'Total Surface Area Of Cone',
        value: 'Total Surface Area Of Cone',
        href: '/calculator/total-surface-area-of-cone-calculator/',
      },
      {
        label: 'Curved Surface Area Of Cone',
        value: 'Curved Surface Area Of Cone',
        href: '/calculator/curved-surface-area-of-cone-calculator/',
      },
      {
        label: 'Volume Of Cylinder',
        value: 'Volume Of Cylinder',
        href: '/calculator/volume-of-cylinder-calculator/',
      },
      {
        label: 'Total Surface Area Of Cylinder',
        value: 'Total Surface Area Of Cylinder',
        href: '/calculator/total-surface-area-of-cylinder-calculator/',
      },
      {
        label: 'Curved Surface Area Of Cylinder',
        value: 'Curved Surface Area Of Cylinder',
        href: '/calculator/curved-surface-area-of-cylinder-calculator/',
      },
      {
        label: 'Volume Of Cuboid ',
        value: 'Volume Of Cuboid ',
        href: '/calculator/volume-of-cuboid-calculator/',
      },
      {
        label: 'Volume Of Cube',
        value: 'Volume Of Cube',
        href: '/calculator/volume-of-cube-calculator/',
      },
      {
        label: 'Distance Of A Point From A Line In 2D',
        value: 'Distance Of A Point From A Line In 2D',
        href: '/calculator/distance-of-point-from-2d-line-calculator/',
      },
      {
        label: 'Distance Of A Point From A Plane',
        value: 'Distance Of A Point From A Plane',
        href: '/calculator/distance-from-point-to-plane-calculator/',
      },
      {
        label: 'Relative Humidity',
        value: 'Relative Humidity',
        href: '/calculator/relative-humidity-calculator/',
      },

      {
        label: 'Bar Correction',
        value: 'Bar Correction',
        href: '/calculator/barcorrection/',
      }, {
        label: 'Dew Point',
        value: 'Dew Point',
        href: '/calculator/dew-point-calculator/',
      },
      {
        label: 'Synop Calculator',
        value: 'Synop Calculator',
        href: '/calculator/synop-calculator/',
      },
      {
        label: 'Distance Between Two Parallel Planes',
        value: 'Distance Between Two Parallel Planes',
        href: '/calculator/distance-between-two-parallel-planes-calculator/',
      },
      {
        label: 'Mid Point Of Line Joining Two Points',
        value: 'Mid Point Of Line Joining Two Points',
        href: '/calculator/midpoint-calculator/',
      },
      {
        label: 'Angle Between Two Planes',
        value: 'Angle Between Two Planes',
        href: '/calculator/angle-between-two-planes-calculator/',
      },
      {
        label: 'Point Of Intersection Of Two Lines In 2D',
        value: 'Point Of Intersection Of Two Lines In 2D',
        href: '/calculator/2d-line-intersection-calculator/',
      },
      {
        label: 'Parallel Perpendicular Line',
        value: 'Parallel Perpendicular Line',
        href: '/calculator/parallel-perpendicular-line/',
      },
      {
        label: 'Volume Of Parallelopiped',
        value: 'Volume Of Parallelopiped',
        href: '/calculator/parallelopiped-volume-calculator/',
      },
      {
        value: 'Equation Of Line Joining Two Points In 3D',
        label: 'Equation Of Line Joining Two Points In 3D',
        href: '/calculator/3d-line-equation-from-two-points-calculator/',
      },
      {
        value: 'Equation Of Plane Passing Through Three Point',
        label: 'Equation Of Plane Passing Through Three Point',
        href: '/calculator/equation-of-a-plane-passing-through-three-points-calculator/',
      },
      {
        value: 'Average Wind Speed',
        label: 'Average Wind Speed',
        href: '/calculator/average-wind-speed-calculator',
      },
      {
        value: 'Angle Between Two Lines',
        label: 'Angle Between Two Lines',
        href: '/calculator/angle-between-two-lines-calculator/',
      },
      {
        value: 'Cross Product Of Two Vectors',
        label: 'Cross Product Of Two Vectors',
        href: '/calculator/cross-product-of-two-vectors-calculator/',
      },
      {
        value: 'Dot Product Of Two Vectors',
        label: 'Dot Product Of Two Vectors',
        href: '/calculator/dot-product-calculator/',
      },
      {
        value: 'Unit Vector',
        label: 'Unit Vector',
        href: '/calculator/unit-vector-calculator/',
      },
      {
        value: 'Eq Of Plane Through a point having a Normal Vector',
        label: 'Eq Of Plane Through a Point having a Normal Vector',
        href: '/calculator/eq-of-plane-through-a-point-having-a-normal-vector-calculator/',
      },
      {
        value: 'Angle Between Line And Plane',
        label: 'Angle Between Line And Plane',
        href: '/calculator/angle-between-line-and-plane-calculator/',
      },
      {
        value: 'Angles Between Two Lines in 3D',
        label: 'Angles Between Two Lines in 3D',
        href: '/calculator/angles-between-two-lines-calculator/',
      },
      {
        value: 'Point Of Intersection Of Line And Plane',
        label: 'Point Of Intersection Of Line And Plane',
        href: '/calculator/point-of-intersection-of-line-and-plane-calculator/',
      },
      {
        value: 'Magnitude Of Vector',
        label: 'Magnitude Of Vector',
        href: '/calculator/vector-magnitude-calculator/',
      },
      {
        value: 'Section Formula',
        label: 'Section Formula',
        href: '/calculator/section-formula-calculator/',
      },
      {
        value: 'Point of intersection of Two Lines in 3D',
        label: 'Point of intersection of Two Lines in 3D',
        href: '/calculator/point-of-intersection-of-two-lines-in-3d/',
      },
      {
        value: 'Shortest distance between two lines in 3D',
        label: 'Shortest distance between two lines in 3D',
        href: '/calculator/shortest-distance-between-two-lines-calculator/',
      },
      {
        label: 'Distance Between Two Parallel Lines',
        value: 'Distance Between Two Parallel Lines',
        href: '/calculator/distance-between-two-parallel-lines-calculator/',
      },
      {
        label: 'Prime Factorisation',
        value: 'Prime Factorisation',
        href: '/calculator/prime-factorization-calculator/',
      },
      {
        label: 'Line of Intersection of Two Planes',
        value: 'Line of Intersection of Two Planes',
        href: '/calculator/line-of-intersection-of-two-planes-calculator/',
      },
      {
        label: 'Factors Of A Number',
        value: 'Factors Of A Number',
        href: '/calculator/factor-calculator/',
      },
      {
        label: 'Distance Between Point And Line In 3D',
        value: 'Distance Between Point And Line In 3D',
        href: '/calculator/distance-from-a-point-to-a-line-in-3-dimensional/',
      },
      {
        label: 'Area of Triangle with Given Vertices in 2D',
        value: 'Area of Triangle with Given Vertices in 2D ',
        href: '/calculator/area-of-triangle-with-coordinates-calculator-in-2d/',
      },
      {
        label: 'Centroid Of A Triangle',
        value: 'Centroid Of A Triangle',
        href: '/calculator/centroid-of-a-triangle-calculator/',
      },
      {
        label: 'Reflection of a Point about a Line',
        value: 'Reflection of a Point about a Line',
        href: '/calculator/reflection-of-a-point-about-a-line/',
      },
      {
        label: 'Incenter Of A Triangle',
        value: 'Incenter Of A Triangle',
        href: '/calculator/incenter-triangle-calculator/',
      },
      {
        label: 'Foot of Perpendicular To Given Line',
        value: 'Foot of Perpendicular To Given Line',
        href: '/calculator/foot-of-perpendicular-to-given-line/',
      },
      {
        label: 'Concurrency Of Straight Line',
        value: 'Concurrency Of Straight Line',
        href: '/calculator/concurrent-lines-calculator/',
      },
      {
        label: 'Volume Of Tetrahedron',
        value: 'Volume Of Tetrahedron',
        href: '/calculator/tetrahedron-volume-calculator/',
      },
      {
        value: 'Volume of the Prism',
        label: 'Volume of the Prism',
        href: '/calculator/volume-of-the-triangular-prism-calculator/',
      },
      {
        label: 'Volume of The Pyramid',
        value: 'Volume of The Pyramid',
        href: '/calculator/pyramid-volume-calculator/',
      },
      {
        label: 'Lowest Common Multiple(LCM)',
        value: 'Lowest Common Multiple(LCM)',
        href: '/calculator/lcm-calculator/',
      },
      {
        label: 'Highest Common Factor(HCF, GCF)',
        value: 'Highest Common Factor(HCF, GCF)',
        href: '/calculator/hcf-calculator/',
      },
      {
        label: 'Fraction Reduction',
        value: 'Fraction Reduction',
        href: '/calculator/fraction-reduction-calculator/',
      },
      {
        label: 'Test Of Collinearity Of Three Points In 2D',
        value: 'Test Of Collinearity Of Three Points In 2D',
        href: '/calculator/collinearity-of-three-points-in-2d/',
      },
      {
        label: 'Improper To Mixed Fraction',
        value: 'Improper To Mixed Fraction',
        href: '/calculator/improper-to-mixed-fraction-calculator/',
      },
      {
        label: 'Fraction Multiplication',
        value: 'Fraction Multiplication',
        href: '/calculator/fraction-multiplication-calculator/',
      },
      {
        label: 'Mixed To Improper Fraction Reduction',
        value: 'Mixed To Improper Fraction Reduction',
        href: '/calculator/mixed-number-to-improper-fraction-calculator/',
      },
      {
        label: 'Fraction Comparison',
        value: 'Fraction Comparison',
        href: '/calculator/comparing-fractions-calculator/',
      },
      {
        label: 'Fraction Addition Substraction',
        value: 'Fraction Addition Substraction',
        href: '/calculator/fraction-addition-substraction-calculator/',
      },
      {
        label: 'Fraction Division',
        value: 'Fraction Division',
        href: '/calculator/fraction-division-calculator/',
      },
      {
        label: 'Long Division Method With Remainder',
        value: 'Long Division Method With Remainder',
        href: '/calculator/long-division-calculator-with-remainders/',
      },
      {
        label: 'Fraction Number To Decimal',
        value: 'Fraction Number To Decimal',
        href: '/calculator/fraction-to-decimal-calculator/',
      },
      {
        label: 'Long Division Method With Decimal',
        value: 'Long Division Method With Decimal',
        href: '/calculator/long-division-calculator-with-decimals/',
      },
      {
        label: 'Angle Between Two Vectors',
        value: 'Angle Between Two Vectors',
        href: '/calculator/angle-between-vectors-calculator/',
      },
      {
        label: 'A Percent of B',
        value: 'A Percent of B',
        href: '/calculator/percentage-calculator/',
      },
      {
        label: 'Square Root With Steps',
        value: 'Square Root With Steps',
        href: '/calculator/square-calculator/',
      },
      {
        label: 'Square Root to its Lowest Form',
        value: 'Square Root to its Lowest Form',
        href: '/calculator/square-root-calculator/',
      },
      {
        label: 'A Is B Percent of What',
        value: 'A Is B Percent of What',
        href: '/calculator/a-is-b-percent-of-what/',
      },
      {
        label: 'A Is What Percent Of B',
        value: 'A Is What Percent Of B',
        href: '/calculator/a-is-what-percent-of-b/',
      },
      {
        label: 'Modulo Calculator',
        value: 'Modulo',
        href: '/calculator/modulo-calculator/',
      },
      {
        value: 'Factorial',
        label: 'Factorial',
        href: '/calculator/factorial-calculator/',
      },
      {
        label: 'Perimeter Of Triangle',
        value: 'Perimeter Of Triangle',
        href: '/calculator/perimeter-of-triangle-calculator/',
      },
      {
        label: 'Perimeter Of Square',
        value: 'Perimeter Of Square',
        href: '/calculator/perimeter-of-square-calculator/',
      },
      {
        label: 'Perimeter Of Circle',
        value: 'Perimeter Of Circle',
        href: '/calculator/perimeter-of-circle-calculator/',
      },
      {
        label: 'Perimeter Of Rhombus',
        value: 'Perimeter Of Rhombus',
        href: '/calculator/perimeter-of-rhombus-calculator/',
      },
      {
        label: 'Perimeter Of Regular Pentagon',
        value: 'Perimeter Of Regular Pentagon',
        href: '/calculator/perimeter-of-regular-pentagon-calculator/',
      },
      {
        label: 'Perimeter Of Regular Hexagon',
        value: 'Perimeter Of Regular Hexagon',
        href: '/calculator/perimeter-of-regular-hexagon-calculator/',
      },
      {
        label: 'Perimeter Of Rectangle',
        value: 'Perimeter Of Rectangle',
        href: '/calculator/perimeter-of-rectangle-calculator/',
      },
      {
        label: 'Perimeter Of Parallelogram',
        value: 'Perimeter Of Parallelogram',
        href: '/calculator/perimeter-of-parallelogram-calculator/',
      },
      {
        label: 'Perimeter Of SemiCircle',
        value: 'Perimeter Of SemiCircle',
        href: '/calculator/perimeter-of-semicircle-calculator/',
      },
      {
        label: 'Perimeter Of Trapezium',
        value: 'Perimeter Of Trapezium',
        href: '/calculator/perimeter-of-trapezium-calculator/',
      },
      {
        label: 'Area of A Regular Hexagon',
        value: 'Area of A Regular Hexagon',
        href: '/calculator/area-of-a-regular-hexagon-calculator/',
      },
      {
        label: 'Decimal To Fraction',
        value: 'Decimal To Fraction',
        href: '/calculator/decimal-to-fraction-calculator/',
      },
      {
        label: 'Decimal Number Addition',
        value: 'Decimal Number Addition',
        href: '/calculator/decimal-addition-calculator/',
      },
      {
        label: 'Decimal Number Subtraction',
        value: 'Decimal Number Subtraction',
        href: '/calculator/decimal-subtraction-calculator/',
      },
      {
        label: 'Decimal Multiplication',
        value: 'Decimal Multiplication',
        href: '/calculator/decimal-multiplication-calculator/',
      },
      {
        label: 'Angle Formed By The Vector With Coordinate Axes',
        value: 'Angle Formed By The Vector With Coordinate Axes',
        href: '/calculator/angle-formed-by-vector-with-coordinate-axes/',
      },
      {
        label: 'Convert Degree To Radian',
        value: 'Convert Degree To Radian',
        href: '/calculator/degrees-to-radians-conversion-calculator/',
      },
      {
        label: 'Convert Radian To Degree',
        value: 'Convert Radian To Degree',
        href: '/calculator/radians-to-degree-conversion-calculator/',
      },
      {
        label: 'Direction cosines of a Vector',
        value: 'Direction cosines of a Vector',
        href: '/calculator/vector-directional-cosines-calculator/',
      },
      {
        label: 'Percentage Difference',
        value: 'Percentage Difference',
        href: '/calculator/percentage-difference-calculator/',
      },
      {
        label: 'Area Of Parallelogram Formed By Two Coincident Vectors',
        value: 'Area Of Parallelogram Formed By Two Coincident Vectors',
        href: '/calculator/area-of-parallelogram-formed-by-two-coincident-vectors-calculator/',
      },
      {
        label: 'Area Of Triangle Formed By Two Coincident Vectors',
        value: 'Area Of Triangle Formed By Two Coincident Vectors',
        href: '/calculator/area-of-triangle-formed-by-two-coincident-vectors/',
      },
      {
        label: 'Decimal Divison',
        value: 'Decimal Divison',
        href: '/calculator/decimal-divison-calculator/',
      },
      {
        label: 'Projection Of a Vector',
        value: 'Projection Of a Vector',
        href: '/calculator/vector-projection-calculator/',
      },
      {
        label: 'Normal to the Plane Containing 3 Points',
        value: 'Normal to the Plane Containing 3 Points',
        href: '/calculator/normal-to-the-plane-containing-3-points-calculator/',
      },
      {
        label: 'Vector Triple Product',
        value: 'Vector Triple Product',
        href: '/calculator/triple-vector-product-calculator/',
      },
      {
        label: 'Scalar Triple Product',
        value: 'Scalar Triple Product',
        href: '/calculator/scalar-triple-product-calculator/',
      },
      {
        label: 'Vector Addition or Subtraction',
        value: 'Vector Addition or Subtraction',
        href: '/calculator/vector-addition-or-subtraction-calculator/',
      },
      {
        label: 'Vector Scalar Multiplication',
        value: 'Vector Scalar Multiplication',
        href: '/calculator/vector-scalar-multiplication-calculator/',
      },
      {
        label: 'Sine',
        value: 'Sine',
        href: '/calculator/sine-calculator/',
      },
      {
        label: 'Cosine',
        value: 'Cosine',
        href: '/calculator/cosine-calculator/',
      },
      {
        label: 'tan',
        value: 'tan',
        href: '/calculator/tangent-calculator/',
      },
      {
        label: 'Cot',
        value: 'Cot',
        href: '/calculator/cotangent-calculator/',
      },
      {
        label: 'Cosec',
        value: 'Cosec',
        href: '/calculator/cosecant-calculator/',
      },
      {
        label: 'Sec',
        value: 'Sec',
        href: '/calculator/secant-calculator/',
      },
      {
        label: 'Sine Inverse',
        value: 'Sine Inverse',
        href: '/calculator/sine-inverse-calculator/',
      },
      {
        label: 'Cosec Inverse',
        value: 'Cosec Inverse ',
        href: '/calculator/cosecant-inverse-calculator/',
      },
      {
        label: 'Sec Inverse',
        value: 'Sec Inverse',
        href: '/calculator/secant-inverse-calculator/',
      },
      {
        label: 'Cos Inverse',
        value: 'Cos Inverse',
        href: '/calculator/cosine-inverse-calculator/',
      },
      {
        label: 'Tan Inverse',
        value: 'Tan Inverse',
        href: '/calculator/tan-inverse-calculator/',
      },
      {
        label: 'Cot Inverse',
        value: 'Cot Inverse',
        href: '/calculator/cotangent-inverse/',
      },
      {
        label: 'Polar To Cartesian Coordinates',
        value: 'Polar To Cartesian Coordinates',
        href: '/calculator/polar-to-cartesian-coordinates-calculator/',
      },
      {
        label: 'Cartesian To Polar Coordinates',
        value: 'Cartesian To Polar Coordinates',
        href: '/calculator/cartesian-to-polar-coordinates-calculator/',
      },
      {
        label: 'Cartesian To Spherical Coordinates',
        value: 'Cartesian To Spherical Coordinates',
        href: '/calculator/cartesian-to-spherical-coordinates-calculator/',
      },
      {
        label: 'Cartesian To Cylindrical Coordinates',
        value: 'Cartesian To Cylindrical Coordinates',
        href: '/calculator/cartesian-to-cylindrical-coordinates-calculator/',
      },

      {
        label: 'New Coordinates By Rotation Of Points',
        value: 'New Coordinates By Rotation Of Points',
        href: '/calculator/new-coordinates-by-rotation-of-points/',
      },
      {
        label: 'Cylindrical To Cartesian Coordinates',
        value: 'Cylindrical To Cartesian Coordinates',
        href: '/calculator/cylindrical-to-cartesian-coordinates/',
      },
      {
        label: 'Cylindrical To Spherical Coordinates',
        value: 'Cylindrical To Spherical Coordinates',
        href: '/calculator/cylindrical-to-spherical-coordinates/',
      },
      {
        label: 'New Coordinates By Rotation Of Axes',
        value: 'New Coordinates By Rotation Of Axes',
        href: '/calculator/new-coordinates-by-rotation-of-axes/',
      },
      {
        label: 'Spherical To Cartesian Coordinates',
        value: 'Spherical To Cartesian Coordinates',
        href: '/calculator/spherical-to-cartesian-coordinates/',
      },
      {
        label: 'Spherical To Cylindrical Coordinates Calculator',
        value: 'Spherical To Cylindrical Coordinates Calculator',
        href: '/calculator/spherical-to-cylindrical-coordinates-calculator/',
      },
      {
        label: 'Hyperbolic Sec',
        value: 'Hyperbolic Sec',
        href: '/calculator/hyperbolic-sec/',
      },
      {
        label: 'Hyperbolic Cot',
        value: 'Hyperbolic Cot',
        href: '/calculator/hyperbolic-cot/',
      },
      {
        label: 'Hyperbolic Tan',
        value: 'Hyperbolic Tan',
        href: '/calculator/hyperbolic-tan/',
      },
      {
        label: 'Hyperbolic Cosine',
        value: 'Hyperbolic Cosine',
        href: '/calculator/hyperbolic-cosine/',
      },
      {
        label: 'Hyperbolic Sine',
        value: 'Hyperbolic Sine',
        href: '/calculator/hyperbolic-sine/',
      },
      {
        label: 'Hyperbolic Cosec',
        value: 'Hyperbolic Cosec',
        href: '/calculator/hyperbolic-cosec/',
      },

      {
        label: 'Inverse Hyperbolic Cosecant',
        value: 'Inverse Hyperbolic Cosecant',
        href: '/calculator/inverse-hyperbolic-cosecant/',
      },
      {
        label: 'Inverse Hyperbolic Secant',
        value: 'Inverse Hyperbolic Secant',
        href: '/calculator/inverse-hyperbolic-secant/',
      },
      {
        label: 'Inverse Hyperbolic Cotangent',
        value: 'Inverse Hyperbolic Cotangent',
        href: '/calculator/inverse-hyperbolic-cotangent/',
      },
      {
        label: 'Inverse Hyperbolic Tangent',
        value: 'Inverse Hyperbolic Tangent',
        href: '/calculator/inverse-hyperbolic-tangent/',
      },
      {
        label: 'Inverse Hyperbolic Cosine',
        value: 'Inverse Hyperbolic Cosine',
        href: '/calculator/inverse-hyperbolic-cosine/',
      },
      {
        label: 'Inverse Hyperbolic Sine',
        value: 'Inverse Hyperbolic Sine',
        href: '/calculator/inverse-hyperbolic-sine/',
      },

      {
        label: 'Addition Subtraction Of Complex Numbers',
        value: 'Addition Subtraction Of Complex Numbers',
        href: '/calculator/addition-subtraction-of-complex-numbers/',
      },

      {
        label: 'Imaginary Part Of A Complex Number',
        value: 'Imaginary Part Of A Complex Number',
        href: '/calculator/imaginary-part-of-a-complex-number/',
      },
      {
        label: 'Real Part Of A Complex Number',
        value: 'Real Part Of A Complex Number',
        href: '/calculator/real-part-of-a-complex-number/',
      },
      {
        label: 'Polar Form of A Complex Number',
        value: 'Polar Form of A Complex Number',
        href: '/calculator/polar-form-of-a-complex-number/',
      },
      {
        label: 'Inverse of A Complex Numbers calculator',
        value: 'Inverse of A Complex Numbers calculator',
        href: `/calculator/inverse-of-a-complex-numbers/`,
      },
      {
        label: 'Division of Two Complex Numbers calculator',
        value: 'Division of Two Complex Numbers calculator',
        href: `/calculator/division-of-two-complex-numbers-calculator/`,
      },
      {
        value: 'Conjugate of Complex Number',
        label: 'Conjugate of Complex Number',
        href: '/calculator/conjugate-of-complex-number/',
      },
      {
        value: 'Argument of a complex Numbers Calculator',
        label: 'Argument of a complex Numbers Calculator',
        href: '/calculator/argument-of-a-complex-number-calculator/',
      },
      {
        value: 'Roots of a Complex number Calculator',
        label: 'Roots of a Complex number Calculator',
        href: '/calculator/root-of-a-complex-numbers-calculator/',
      },
      {
        label: 'Algebraic Polynomials Addition Subtraction',
        value: 'Algebraic Polynomials Addition Subtraction',
        href: '/calculator/algebraic-polynomials-addition-subtraction/',
      },
      {
        label: 'Algebraic Polynomials Long Division',
        value: 'Algebraic Polynomials Long Division',
        href: '/calculator/algebraic-polynomials-long-division/',
      },
      {
        label: 'Algebraic Polynomials Multiplication',
        value: 'Algebraic Polynomials Multiplication',
        href: '/calculator/algebraic-polynomials-multiplication/',
      },
      {
        label: 'Matrices Addition or Subtraction',
        value: 'Matrices Addition or Subtraction',
        href: '/calculator/matrices-addition-or-subtraction/',
      },
      {
        label: 'Determinant of a matrix',
        value: 'Determinant of a matrix',
        href: '/calculator/determinant-of-a-matrix/',
      },
      {
        label: 'Adjoint of a matrix',
        value: 'Adjoint of a matrix',
        href: '/calculator/adjoint-of-a-matrix/',
      },
      {
        label: 'Matrix Of Cofactors',
        value: 'Matrix Of Cofactors',
        href: '/calculator/matrix-of-cofactors/',
      },
      {
        label: 'Matrices Power',
        value: 'Matrices Power',
        href: '/calculator/power-of-a-matrix/',
      },
      {
        label: 'Inverse of A Matrix',
        value: 'Inverse of A Matrix',
        href: '/calculator/inverse-of-a-matrix/',
      },
      {
        label: "Cramer's Rule",
        value: "Cramer's Rule",
        href: '/calculator/cramers-rule/',
      },
      {
        label: 'Matrix Multiplication',
        value: 'Matrix Multiplication',
        href: '/calculator/matrix-multiplication/',
      },
      {
        label: ' Matrix of Minors',
        value: ' Matrix of Minors',
        href: ' /calculator/matrix-of-minors/',
      },
      {
        label: 'Transpose of A Matrix',
        value: 'Transpose of A Matrix',
        href: '/calculator/transpose-of-a-matrix/',
      },
      {
        label: 'Trace of a matrix',
        value: 'Trace of a matrix',
        href: '/calculator/trace-of-a-matrix/',
      },
      {
        label: 'Matrix Scalar Multiplication',
        value: 'Matrix Scalar Multiplicaiton',
        href: '/calculator/matrix-scalar-multiplication/',
      },
      {
        label: 'Matrix Division',
        value: 'Matrix Division',
        href: '/calculator/matrix-division/',
      },
      {
        label: 'Row Echelon Form of a Matrix',
        value: 'Row Echelon Form of a Matrix',
        href: '/calculator/row-echelon-form-of-a-matrix/',
      },
      {
        label: `Reduced Row Echelon Form of a Matrix`,
        value: `Reduced Row Echelon Form of a Matrix`,
        href: `/calculator/reduced-row-echelon-form-of-a-matrix/`,
      },
      {
        label: `Row Space of a Matrix`,
        value: `Row Space of a Matrix`,
        href: `/calculator/row-space-of-a-matrix/`,
      },
      {
        label: `Column Space of a Matrix`,
        value: `Column Space of a Matrix`,
        href: `/calculator/column-space-of-a-matrix/`,
      },
      {
        label: `Rank of a Matrix`,
        value: `Rank of a Matrix`,
        href: `/calculator/rank-of-a-matrix/`,
      },
      {
        label: `Characterstic polynomial Calculator`,
        value: `Characterstic polynomial Calculator`,
        href: '/calculator/characteristic-polynomial-calculator/',
      },
      {
        label: `Gaussian Elimination Calculator`,
        value: `Gaussian Elimination Calculator`,
        href: `/calculator/gaussian-elimination-calculator/`,
      },
      {
        label: `Gauss Jordan Elimination Calculator`,
        value: `Gauss Jordan Elimination Calculator`,
        href: '/calculator/gauss-jordan-elimination-calculator/',
      },
      {
        label: `Basis of a Matrix Calculator`,
        value: `Basis of a Matrix Calculator`,
        href: '/calculator/basis-of-a-matrix-calculator/',
      },
      {
        label: 'Linear Independence of a Matrix',
        value: 'Linear Independence of a Matrix',
        href: '/calculator/linear-independence-of-a-matrix-calculator/',
      },
      {
        label: 'Null Space or Kernel or Nulity Calculator',
        value: 'Null Space or Kernel or Nulity Calculator',
        href: '/calculator/null-space-or-kernel-or-nulity-calculator/',
      },
      {
        label: 'Solving System of Linear Equation',
        value: 'Solving System of Linear Equation',
        href: '/calculator/solving-system-of-linear-equation-calculator/',
      },
      {
        label: 'Nature of Solution for System of Linear Equation',
        value: 'Nature of Solution for System of Linear Equation',
        href: '/calculator/nature-of-solution-for-system-of-linear-equations-calculator/',
      },
      {
        label: 'Solving Algebraic Equations',
        value: 'Solving Algebraic Equations',
        href: '/calculator/solving-algebraic-equations-calculator/',
      },
      {
        label: 'Evaluate Function Value Calculator',
        value: 'Evalueate Function Value Calculator',
        href: '/calculator/evaluate-function-value-calculator/',
      },
      {
        label: 'Eigen Value and Eigen Vector',
        value: 'Eigen Value and Eigen Vector',
        href: '/calculator/eigen-value-and-eigen-vector-calculator/',
      },
      {
        label: 'Transition Matrix',
        value: 'Transition Matrix',
        href: '/calculator/transition-matrix-calculator/',
      },
      {
        label: 'Diagonalize Matrix',
        value: 'Diagonalize Matrix',
        href: '/calculator/diagonalize-matrix-calculator/',
      },
      {
        label: 'LU Decomposition',
        value: 'LU Decomposition',
        href: `/calculator/lu-decomposition-calculator/`,
      },

      {
        value: 'Gram Schmidt',
        label: 'Gram Schmidt',
        href: '/calculator/gram-schmidt-calculator/',
      },
      {
        value: 'Moore Penrose Inverse',
        label: 'Moore Penrose Inverse',
        href: '/calculator/moore-penrose-inverse-calculator/',
      },
      {
        value: 'Orthogonal Complement',
        label: 'Orthogonal Complement',
        href: '/calculator/orthogonal-complement-calculator/',
      },
      {
        value: 'Singular Value Decompostion',
        label: 'Singular Value Decompostion',
        href: '/calculator/singular-value-decomposition-calculator/',
      },
      {
        value: 'QR Factorization',
        label: 'QR Factorization',
        href: '/calculator/qr-factorization-calculator/',
      },
      {
        label: 'Binomial Expansion',
        value: 'Binomial Expansion',
        href: '/calculator/binomial-expansion-calculator/',
      },
      {
        label: 'Average Rate of Change',
        value: 'Average Rate of Change',
        href: '/calculator/average-rate-of-change-calculator/',
      },
      {
        label: 'Riemann Sum for a Function',
        value: 'Riemann Sum for a Function',
        href: '/calculator/riemann-sum-for-a-function-calculator/',
      },
      {
        label: 'Necklace Permutation',
        value: 'Necklace Permutation',
        href: '/calculator/necklace-permutation/',
      },
      {
        href: '/calculator/mid-point-rule-of-a-function-calculator/',
        label: 'Midpoint Rule of a Function',
        value: 'Midpoint Rule of a Function',
      },
      {
        href: '/calculator/riemann-sum-for-a-table-calculator/',
        label: 'Riemann Sum for a Table',
        value: 'Riemann Sum for a Table',
      },
      {
        href: '/calculator/trapezoidal-rule-for-a-table-calculator/',
        label: 'Trapezoidal Rule for a Table',
        value: 'Trapezoidal Rule for a Table',
      },
      {
        href: '/calculator/trapezoidal-rule-for-a-function-calculator/',
        label: 'Trapezoidal Rule for a Function',
        value: 'Trapezoidal Rule for a Function',
      },
      {
        href: '/calculator/mid-point-rule-for-a-table-calculator/',
        label: 'MidPoint Rule Calculator for a Table',
        value: 'MidPoint Rule Calculator for a Table',
      },
      {
        href: '/calculator/simpons-one-third-rule-for-a-function-calculator/',
        value: 'Simpson’s one third rule for a function',
        label: 'Simpson’s one third rule for a function',
      },
      {
        href: '/calculator/simpons-three-by-eight-rule-for-a-function-calculator/',
        value: 'Simpson’s three by eight rule for a function',
        label: 'Simpson’s three by eight rule for a function',
      },
      {
        href: '/calculator/simpons-one-third-rule-for-a-table-calculator/',
        value: 'Simpson’s one third Rule for a Table',
        label: 'Simpson’s one third Rule for a Table',
      },
      {
        href: '/calculator/simpons-three-by-eight-rule-for-a-table-calculator/',
        label: 'Simpson’s three by eight Rule for a Table',
        value: 'Simpson’s three by eight Rule for a Table',
      },
      {
        label: 'Derivative',
        value: 'Derivative',
        href: '/calculator/derivative-calculator/',
      },
      {
        label: 'Harmonic Mean',
        value: 'Harmonic Mean',
        href: '/calculator/harmonic-mean-calculator/',
      },
      {
        label: 'Percentile',
        value: 'Percentile',
        href: '/calculator/percentile-calculator/',
      },
      {
        label: 'Mode',
        value: 'Mode',
        href: '/calculator/mode-calculator/',
      },
      {
        label: 'Median',
        value: 'Median',
        href: '/calculator/median-calculator/',
      },
      {
        label: 'Lower Quartile',
        value: 'Lower Quartile',
        href: '/calculator/lower-quartile-calculator/',
      },
      {
        label: 'Upper Quartile',
        value: 'Upper Quartile',
        href: '/calculator/upper-quartile-calculator/',
      },
      {
        label: 'Five Number Summary',
        value: 'Five Number Summary',
        href: '/calculator/five-number-summary-calculator/',
      },
      {
        label: 'InterQuartile Range',
        value: 'InterQuartile Range',
        href: '/calculator/interquartile-range-calculator/',
      },
      {
        label: 'Difference Quotient',
        value: 'Difference Quotient',
        href: '/calculator/difference-quotient-calculator/',
      },
      {
        label: 'Range Of Data Set',
        value: 'Range Of Data Set',
        href: '/calculator/range-of-data-set-calculator/',
      },
      {
        label: 'Linear Regression (Line of best fit)',
        value: 'Linear Regression (Line of best fit)',
        href: '/calculator/linear-regression-calculator/',
      },
      {
        label: 'Percentile Rank Calculator',
        value: 'Percentile Rank Calculator',
        href: '/calculator/percentile-rank-calculator/',
      },
      {
        label: `Euler's Method`,
        value: `Euler's Method`,
        href: `/calculator/euler-method-calculator/`,
      },
      {
        label: 'Quadratic Regression (Line of best fit)',
        value: 'Quadratic Regression (Line of best fit)',
        href: '/calculator/quadratic-regression-calculator/',
      },
      {
        label: 'Root Mean Square (RMS)',
        value: 'Root Mean Square (RMS)',
        href: '/calculator/root-mean-square-calculator/',
      },
      {
        label: 'Covariance Calculator',
        value: 'Covariance Calculator',
        href: '/calculator/covariance-calculator/',
      },
      {
        label: 'Standard Deviation Calculator',
        value: 'Standard Deviation Calculator',
        href: '/calculator/standard-deviation-calculator/',
      },
      {
        label: 'Variance Calculator',
        value: 'Variance Calculator',
        href: '/calculator/variance-calculator/',
      },
      {
        label: 'Pearson Correlation Coefficient Calculator',
        value: 'Pearson Correlation Coefficient Calculator',
        href: '/calculator/pearson-correlation-coefficient-calculator/',
      },
      {
        label: 'Coefficient Of Variation Calculator',
        value: 'Coefficient Of Variation Calculator',
        href: '/calculator/coefficient-of-variation-calculator/',
      },
      {
        label: 'Beta Distribution',
        value: 'Beta Distribution',
        href: '/calculator/beta-distribution-calculator/',
      },
      {
        label: 'Poisson Distribution Calculator',
        value: 'Poisson Distribution Calculator',
        href: '/calculator/poisson-distribution-calculator/',
      },
      {
        label: 'P Value Calculator',
        value: 'P Value Calculator',
        href: '/calculator/p-value-calculator/',
      },
      {
        label: 'Box And Whisker Plot',
        value: 'Box And Whisker Plot',
        href: '/calculator/box-and-whisker-plot-calculator/',
      },
      {
        label: 'Z Score Calculator',
        value: 'Z Score Calculator',
        href: '/calculator/z-score-calculator/',
      },
      {
        label: 'Binomial Distribution',
        value: 'Binomial Distribution',
        href: '/calculator/binomial-distribution-calculator/',
      },
      {
        label: 'Exponential Distribution',
        value: 'Exponential Distribution',
        href: '/calculator/exponential-distribution-calculator/',
      },
      {
        label: 'Geometric Distribution',
        value: 'Geometric Distribution',
        href: '/calculator/geometric-distribution-calculator/',
      },
      {
        label: 'Margin Of Error',
        value: 'Margin Of Error',
        href: '/calculator/margin-of-error-calculator/',
      },

      {
        label: 'Hypergeometric Distribution',
        value: 'Hypergeometric Distribution',
        href: '/calculator/hypergeometric-distribution-calculator/',
      },

      {
        label: 'Normal Distribution',
        value: 'Normal Distribution',
        href: '/calculator/normal-distribution-calculator/',
      },
      {
        label: 'Laplace Transform',
        value: 'Laplace Transform',
        href: '/calculator/laplace-transform-calculator/',
      },
      {
        label: 'X & Y Intercept',
        value: 'X & Y Intercept',
        href: '/calculator/intercept-calculator/',
      },
      {
        label: 'Foil Method',
        value: 'Foil Method',
        href: '/calculator/foil-method-calculator/',
      },
      {
        label: 'Fraction to Percent',
        value: 'Fraction to Percent',
        href: '/calculator/fraction-to-percent-calculator/',
      },
      {
        label: 'Decimal to Percent',
        value: 'Decimal to Percent',
        href: '/calculator/decimal-to-percent-calculator/',
      },
      {
        label: 'Percent to Decimal',
        value: 'Percent to Decimal',
        href: '/calculator/percent-to-decimal-calculator/',
      },
      {
        label: 'Percent to Fraction',
        value: 'Percent to Fraction',
        href: '/calculator/percent-to-fraction-calculator/',
      },
      {
        label: 'Scientific Notation',
        value: 'Scientific Notation',
        href: '/calculator/scientific-notation-calculator/',
      },
      {
        label: 'Discriminant',
        value: 'Discriminant',
        href: '/calculator/discriminant-calculator/',
      },
      {
        label: 'Logarithm',
        value: 'Logarithm',
        href: '/calculator/logarithm-calculator/',
      },
      {
        label: 'Cube Root',
        value: 'Cube Root',
        href: '/calculator/cube-root-calculator/',
      },
      {
        label: 'Nth Root',
        value: 'Nth Root',
        href: '/calculator/nth-root-calculator/',
      },
      {
        label: 'Exponential Function',
        value: 'Exponential Function',
        href: '/calculator/exponential-function-calculator/',
      },
      {
        label: 'Remainder Theorem',
        value: 'Remainder Theorem',
        href: '/calculator/remainder-theorem-calculator/',
      },
      {
        label: 'Rational Zeros Theorem',
        value: 'Rational Zeros Theorem',
        href: '/calculator/rational-zeros-theorem-calculator/',
      },
      {
        label: 'Degree and Leading Coefficient',
        value: 'Degree and Leading Coefficient',
        href: '/calculator/degree-and-leading-coefficient-calculator/',
      },

      {
        label: 'BMI (Body Mass Index)',
        value: 'BMI (Body Mass Index)',
        href: '/calculator/bmi-calculator/',
      },
      {
        label: 'Period',
        value: 'Period',
        href: '/calculator/period-calculator/',
      },
      {
        label: '8th Pay Commission Salary',
        value: '8th Pay Commission Salary',
        href: '/calculator/8th-pay-commission-salary-calculator/',
      },
      {
        label: 'Age',
        value: 'Age',
        href: '/calculator/age-calculator/',
      },
      {
        label: 'Simple Interest',
        value: 'Simple Interest',
        href: '/calculator/simple-interest-calculator/',
      },
      {
        label: 'Compound Interest',
        value: 'Compound Interest',
        href: '/calculator/compound-interest-calculator/',
      },
      {
        label: 'Space Travel Cost',
        value: 'Space Travel Cost',
        href: '/calculator/space-travel-cost-calculator/',
      },
      {
        label: 'Weight on Mars',
        value: 'Weight on Mars',
        href: '/calculator/weight-on-mars-calculator/',
      },
    ],
    []
  );

  return <Dropdown title="Select Calculator" items={calculators} />;
};

export default SelectCalculator;

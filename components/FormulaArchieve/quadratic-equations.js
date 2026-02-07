import React from "react";
import MetaTags from "../SEO/MetTags";
import Notes from "../Common/Notes";

const QuadraticEquations = () => {
  const content = {
    title: "Formula Sheet",
    description: [
      {
        value: `QUADRATIC EQUATION`,
        type: "h4",
      },
      {
        value: `1. SOLUTION Of QUADRATIC EQUATION & RELATION 
        BETWEEN ROOTS & CO-EffICIENTS : `,
        type: "h6",
      },
      {
        value: `<b>(a) </b> The solutions of the quadratic equation, ax<sup>2</sup> + bx + c = 0 is given by`,
        type: "span",
      },
      {
        value: `given\\space by\\space x={-b ± \\sqrt{b^2-4ac} \\above{1pt}2a}  `,
        type: "equation",
      },
      {
        value: `<b>(b) </b>The expression b<sup>2</sup> - 4 ac  D is called the discriminant of the 
        quadratic equation. `,
        type: "span",
      },
      "br",
      {
        value: `<b>(c) </b> If (	α & β) are the roots of the quadratic equation ax<sup>2</sup> + bx + c = 0, 
        then; 
        `,
        type: "span",
      },
      {
        value: `\\bold{(i)}\\space \\enspace	\\alpha + \\beta ={-b\\above{1pt}a} `,
        type: "equation",
      },
      {
        value: `\\bold{(ii)}\\space	\\alpha \\beta \\space= {c\\above{1pt}a} `,
        type: "equation",
      },
      {
        value: `\\bold{(iii)}\\space |\\alpha - \\beta|= {\\sqrt{D}\\above{1pt}|a|} `,
        type: "equation",
      },
      {
        value: `(d)\\space Quadratic \\space equation\\space whose\\space roots\\space are \\space \\alpha\\space \\&  \\space is \\space(x-\\alpha)\\space(x-\\beta)=0\\space i.e.`,
        type: "equation",
      },
      {
        value: `x^2-(\\alpha+\\beta)x+\\alpha\\beta=0\\space i.e. \\space x^2-(sum \\space of \\space roots )\\space x \\space+ \\space product\\space of\\space 
        \\space roots - O .  `,
        type: "equation",
      },
      {
        value: `2. NATURE Of ROOTS:  `,
        type: "h6",
      },
      "br",
      {
        value: `(a) Consider the quadratic equation ax<sup>2</sup> + bx + c = 0 where a, b, 
        c  ∈  R & a ≠ Othen;  `,
        type: "span",
      },
      "br",
      {
        value: `(ii) D > 0 ⇔ roots are real & distinct (unequal). 
      `,
        type: "span",
      },
      "br",
      {
        value: `(iii) D = 0 ⇔ roots are real & coincident (equal)  `,
        type: "span",
      },
      "br",
      {
        value: `(iv) If p + i q is one root of a quadratic equation, then the 
        other root must be the conjugate p - I q & vice versa.`,
        type: "span",
      },
      {
        value: ` (p\\space, q\\space \\epsilon \\space R \\space \\& i=\\sqrt{-1})`,
        type: "equation",
      },
      {
        value: `<b>(b)</b> Consider the quadratic equation ax<sup>2</sup> + bx + c = 0 where a,b, C ∈ Q & a ≠  0 then; `,
        type: "span",
      },
      "br",
      {
        value: `<b>(i)</b> If D is a perfect square, then roots are rational.`,
        type: "span",
      },
      {
        value: `\\bold{(ii)}\\space If \\space \\alpha  = p + \\sqrt{q} \\space is\\space \\space one\\space root\\space in\\space this\\space case,  `,
        type: "equation",
      },
      {
        value: `(where\\space p\\space is\\space rational\\space 
          \\& \\space \\sqrt{q}.\\space is\\space a\\space surd)\\space then\\space other\\space root\\space will\\space be\\space p-\\space \\sqrt{q}.  `,
        type: "equation",
      },
      {
        value: ` 3. COMMON ROOTS OF lWO QUADRATIC EQUATIONS  `,
        type: "h6",
      },

      {
        value: `<b>(a)</b>Only one common root.  `,
        type: "span",
      },
      "br",
      {
        value: `Let a be the common root of ax<sup>2</sup> + bx + c = 0 & a'x<sup>2</sup> + b'x + c' = 0 `,
        type: "span",
      },
      "br",
      {
        value: `then a ex ' + b ex + c = 0 & a' ex ' + b' ex + c' = 0 , By Cramer's `,
        type: "span",
      },

      "br",
      {
        value: `a \\alpha^2 +b\\alpha+c=0 \\space \\& \\space a'\\alpha^2+b'\\alpha+c'=0.   `,
        type: "equation",
      },
      {
        value: `By\\space Cramer's\\space Rule\\space {a^2\\above{1pt}a'c-ac}={a\\above{1pt}a'c-ac'}={1\\above{1pt}ab'-a'b} 
          `,
        type: "equation",
      },
      {
        value: `Therefore,\\space a ={ca'-c'a\\above{1pt}ab'-a'b} ={bc'-b'c\\above{1pt}a'c-ac'} 
          `,
        type: "equation",
      },

      {
        value: ` So the condition for a common root is `,
        type: "span",
      },
      "br",
      {
        value: ` (ca' c'a)^2=(ab'-a'b)(bc'-b'c)`,
        type: "equation",
      },

      {
        value: `\\bold{(b)}\\space If\\space both\\space roots\\space are\\space same\\space then\\space {a\\above{1pt}a'}= {b\\above{1pt}b'}={c\\above{1pt}c'}`,
        type: "equation",
      },
      {
        value: `4. ROOTS UNDER PARTICUlAR CASES `,
        type: "h6",
      },
      {
        value: `Let the quadratic equation ax2 + bx + c = 0 has real roots and  `,
        type: "span",
      },
      "br",
      {
        value: `<b>(a)</b> If b = 0  ⇒  roots are of equal magnitude but of opposite sign  `,
        type: "span",
      },
      {
        value: `\\bold{(b)}\\space If\\space c = 0  ⇒ one\\space roots\\space is\\space zero\\space other\\space is\\space -{b\\above{1pt}a}  `,
        type: "equation",
      },

      {
        value: `\\bold{(c)}\\space If\\space a = c ⇒  roots\\space are\\space reciprocal\\space to\\space each\\space other  `,
        type: "equation",
      },

      {
        value: `\\bold{(d)}\\space If \\space
        \\begin{rcases}
   a>0 &\\text c<0 \\\\
   a<0 &\\text  c>0
\\end{rcases}⇒roots\\space are\\space of\\space opposite\\space signs `,
        type: "equation",
      },
      {
        value: `\\bold{(e)}\\space If \\space
        \\begin{rcases}
   a>0,\\space  b>0 &\\text c>0 \\\\
   a<0,\\space b<0 &\\text  c<0
\\end{rcases}⇒ both\\space roots\\space are\\space negative. `,
        type: "equation",
      },
      {
        value: `\\bold{(f)}\\space If \\space
        \\begin{rcases}
   a>0,\\space  b<0, &\\text c>0 \\\\
   a<0,\\space b>0, &\\text  c<0
\\end{rcases}⇒ both\\space roots\\space are\\space positive. `,
        type: "equation",
      },
      {
        value: `<b>(g)</b> If sign of a = sign of b  ≠  sign of c ⇒ 
        magnitude is negative, `,
        type: "span",
      },
      "br",
      {
        value: `<b>(h)</b>If sign of b = sign of c  ≠  sign of a ⇒ Greater root in magnitude is positive,
        `,
        type: "span",
      },
      "br",
      {
        value: `\\bold{(i)}\\space If\\space  a + b + c =\\space0⇒\\space one\\space root\\space is\\space 1\\space and\\space second\\space root\\space is\\space {c\\above{1pt}a}
        `,
        type: "equation",
      },
      {
        value: `5. MAXIMUM&MINIMUMVAUJES OF QUADRATIC EXPRESSION : `,
        type: "h6",
      },
      {
        value: `Maximum\\space \\&\\space Minimum\\space Values\\space of\\space expression\\space y - ax^2 + bx + c\\space is\\space{-D\\above{1pt}4a}  `,
        type: "equation",
      },
      {
        value: ` which\\space occurs\\space at\\space x = - ( {b\\above{1pt}2a} )\\space according\\space as\\space a < 0\\space or\\space a >\\space O. 
        `,
        type: "equation",
      },
      {
        value: ` y\\space \\isin \\bigg[{-D\\above{1pt}4a},\\infty\\bigg)\\space if \\space a>0 \\space \\& \\space y\\space \\bigg( -\\infty,{-D\\above{1pt}4a}\\bigg] \\space if \\space a<0. `,
        type: "equation",
      },
      {
        value: `6. LOCATION OF ROOTS:  `,
        type: "h6",
      },
      {
        value: ` Let f(x ) = ax<sup>2</sup> + bx + c, where a, b, c ∈ R, a ≠ 0  `,
        type: "span",
      },
      "br",
      {
        value: ` <b>(a)</b> Conditions for both the roots of f(x) = 0 to be greater than a specified number <b>'d'</b> are D  `,
        type: "span",
      },
      "br",
      {
        value: ` \\bold{D  \\leq 0; \\space a.f(d) > 0 \\& ({-b\\above{1pt}2a})>d}.`,
        type: "equation",
      },
      {
        src: `/images/notesImages/RootLocationA.png`,
        type: "img",
        className: "h-50 w-50",
        alt: "Area Of Trapezium Image 3",
      },
      {
        value: `<b>(b)</b>  Conditions for the both roots of f(x ) - 0 to lie on either side of 
        the number 'd' in other words the number 'd' lies between the 
       roots of`,
        type: "span",
      },
      {
        value: ` f(x)=0 \\space is\\space \\bold{ a.f (d) <0.}`,
        type: "equation",
      },
      {
        src: `/images/notesImages/RootLocationB.png`,
        type: "img",
        className: "h-50 w-50",
        alt: "Area Of Trapezium Image 3",
      },
      {
        value: `<b>(c)</b> Conditions for exactly one root of fIx) - 0 to lie in the interval 
        (d,e) i.e .. d < x < e is <b> f(d). f(e) < 0 </b>`,
        type: "span",
      },
      "br",
      {
        src: `/images/notesImages/RootLocationC.png`,
        type: "img",
        className: "h-50 w-50",
        alt: "Area Of Trapezium Image 3",
      },
      {
        value: `<b>(d)</b> Conditions that both roots of fIx) - 0 to be confined between 
        the numbers d & e are (here d <e).`,
        type: "span",
      },

      {
        value: `D\\space 0;\\space a.f(d) > O\\&af(e) > 0; d < ({-b\\above{1pt}2a}) <e `,
        type: "equation",
      },
      {
        src: `/images/notesImages/RootLocationD.png`,
        type: "img",
        className: "h-50 w-50",
        alt: "Area Of Trapezium Image 3",
      },
      "br",
      {
        value: `7. GENERAL QUADRATIC EXPRESSION IN TWO VARIABLES :  `,
        type: "h6",
      },
      {
        value: `f(x,y) = ax<sup>2</sup> + 2 hxy + 2gx + 2 fy + c may be resolved into two linear factors if;`,
        type: "span",
      },
      "br",
      {
        value: `\\Delta = abc+ 2fgh-af^2-bg^2 -ch^2 =0\\space OR \\space \\begin{bmatrix}
        a & h & g \\\\
        h & b & f \\\\
        g & f & c 
     \\end{bmatrix}=0`,
        type: "equation",
      },
      {
        value: `8. THEORY OF EQUATIONS :   `,
        type: "h6",
      },
      {
        value: ` If \\space a_1,a_2,a_3,..........a_n \\space are\\space the\\space roots\\space of\\space the\\space equation;`,
        type: "equation",
      },
      {
        value: ` f(x)= \\space a_0x^n+a_1\\space x^{n-1} + a_2x^{n-2}+ .....+ a_{n-1}x+a_n =0 \\space where\\space a_0, a_1.......a_n`,
        type: "equation",
      },
      {
        value: `are\\space constants\\space a<sub>0</sub>  ≠ 0 then, `,
        type: "span",
      },
      {
        value: `\\sum a_1 = -{a_1 \\above{1pt}a_0},\\sum a_1 a_2 = + {a_2\\above{1pt}a_0},\\sum a_1 a_2 a_3`,
        type: "equation",
      },

      {
        value: `-{a_1 \\above{1pt}a_0},..... a_1 a_2 a_3......a_n =(-1)^n{a_n\\above{1pt}a_0}`,
        type: "equation",
      },
      {
        value: `<b>Note :</b> `,
        type: "span",
      },
      "br",
      {
        value: `<b>(i)</b> Every odd degree equation has at least one real root whose 
        sign is opposite to that 01 its last term. when coefficient 01 highest 
        degree term is (+)ve {If not then make it (+) ve}. 
          `,
        type: "span",
      },
      {
        value: `Ex.\\space x^3-x^2+x-1=0 `,
        type: "equation",
      },
      {
        value: `<b>(ii)</b> Even degree polynomial whose last term is (-)ve & coefficient 
        01 highest degree term is (+)ve has atleast two real roots. one 
        (+)ve & one (-)ve . 
          `,
        type: "span",
      },
      "br",
      {
        value: `<b>(iii)</b> If equation contains only even power 01 x & all coefficient are 
        (+)ve. then all roots are imaginary.`,
        type: "span",
      },
    ],
  };

  return (
    <>
      <MetaTags
        title="Formula Archieve"
        description="Doubtlet understands that the Academic process in a student’s life has its own crust and 
        trough. But the integrity, solidarity, and commitment shown during the process make a learner and 
        instructor ascend in life."
      />
      <div className="main-content">
        <div className="container formula-container">
          <Notes {...content} />
        </div>
      </div>
    </>
  );
};

export default QuadraticEquations;

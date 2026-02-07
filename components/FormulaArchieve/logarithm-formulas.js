import React from "react";
import MetaTags from "../SEO/MetTags";
import Notes from "../Common/Notes";

const LogarithmFormulas = () => {
  const content = {
    title: "Formula Sheet",
    description: [
      {
        value: `Logarithm`,
        type: "h4",
      },
      {
        value: `Logarithm Of A Number :`,
        type: "h6",
      },
      {
        value: `The logarithm of the number N to the base 'a' is <br>the exponent indicating the power to which the base must be raised to obtain the number N`,
        type: "span",
      },
      {
        value: `This \\space number \\space is \\space designated \\space as \\space \\log_{10} N`,
        type: "equation",
      },
      {
        value: `(a) \\enspace \\log_{10} N = x,`,
        type: "equation",
      },
      {
        value: `read \\space as \\space log \\space of \\space N \\space to \\space the \\space base \\space 
        a \\space \\longleftrightarrow a^{x} = N`,
        type: "equation",
      },
      {
        value: `If \\space a = 10 \\space then \\space we \\space write\\space \log N\\space or\\space log_{10} 
        N\\space and\\space if\\space a = e\\space we\\space write\\space in\\space N\\space or\\space 
        \\log_{e} N\\space (Natural\\space log)`,
        type: "equation",
      },
      {
        value: `(b) \\enspace Necessary \\space condition : N \\gt 0; a>0:a \\not=1`,
        type: "equation",
      },
      {
        value: `(c) \\enspace \\log_{a} 1 = 0`,
        type: "equation",
      },
      {
        value: `(d) \\enspace \\log_{a} a = 1`,
        type: "equation",
      },
      {
        value: `(e) \\enspace \\log_{\\large 1 \\above{1pt} a} a = -1`,
        type: "equation",
      },
      {
        value: `(f) \\enspace \\log_{a} (x.y) =  \\log_{a} x + \\log_{a} y; \\space x, \\space y \\gt 0`,
        type: "equation",
      },
      {
        value: `(g) \\enspace \\log_{a} { x \\above{1pt} y} =  \\log_{a} x - \\log_{a} y; \\space x, \\space y \\gt 0`,
        type: "equation",
      },
      {
        value: `(h) \\enspace \\log_{a} (x^p) = \\log_{a} x - \\log_{a} y; \\space x, \\space y \\gt 0`,
        type: "equation",
      },
      {
        value: `(i) \\enspace \\log_{\\large a^p} x = { 1 \\above{1pt} p} \\log_{a} x. \\space  x \\space \\gt 0`,
        type: "equation",
      },
      {
        value: `(j) \\enspace \\log_{a} x = { 1 { \\log_{x} \\above{1pt} a}}; \\space  x \\space \\gt 0, 
        x \\space \\not = \\space 1 `,
        type: "equation",
      },
      {
        value: `(k) \\enspace \\log_{a} x = {\\frac {\\log_{b} x} {\\log_{b} a}}; \\space  x \\space\\gt 0, \\space a,
         \\space b\\gt0, \\space a \\space \\not = \\space 1, \\space b \\space \\not = \\space 1`,
        type: "equation",
      },
      {
        value: `(l) \\enspace \\log_{a} b \\space \\log_{b} c \\space \\log_{c} d = \\space \\log_{a} d \\space
        `,
        type: "equation",
      },
      {
        value: `where \\space  a, \\space b, \\space c, \\space d \\space \\gt 0, \\space and \\space \\not = 
        \\space 1, `,
        type: "equation",
      },
      {
        value: `(m) \\enspace \\large a^{\\large \\log_{\\large a} x} \\space = \\space x \\space; \\space a \\gt 0, \\space a \\space \\not = \\space 1,`,
        type: "equation",
      },
      {
        value: `(n) \\enspace \\large a^{\\large \\log_{\\large b} c}  \\space = \\space  \\space \\large c^{\\large \\log_{\\large b} a} \\space \\space;  \\space 
        a, \\space b, \\space c, \\space \\gt \\space 0 \\space and \\space \\not =  \\space 1`,
        type: "equation",
      },
      {
        value: `(o) \\enspace \\log_a x = \\log_a y \\longleftrightarrow \\bigg \\lbrack \\begin{array}{cc}
        x<y & if & a>1 \\\\
        x>y & if & 0<a<1
     \\end{array}`,
        type: "equation",
      },
      {
        value: `(p) \\enspace \\log_a x = \\log_a y \\implies x = y; x, y > 0; a > 0, a \\not = 1`,
        type: "equation",
      },
      {
        value: `(q) \\enspace \\large e^{\\ln a^x} = a^x`,
        type: "equation",
      },
      {
        value: `(r) \\enspace \\log_{10} 2 = 0.3010; \\log_{10} 3 = 0.4771; \\ln 2 = 0.693, \\ln 10 = 2.303`,
        type: "equation",
      },
      {
        value: `(s) \\enspace If \\space a > 1 \\space then \\log_a x < p \\implies 0 < x < a^p`,
        type: "equation",
      },
      {
        value: `(t) \\enspace If \\space a > 1 \\space then \\log_a x > p \\implies 0 > x > a^p`,
        type: "equation",
      },
      {
        value: `(u) \\enspace If \\space 0 < a < 1 \\space then \\space \\log_a x < p \\implies x > a^p `,
        type: "equation",
      },
      {
        value: `(v) \\enspace If \\space 0 < a < 1 \\space then \\space \\log_a x > p \\implies 0 < x < a^p `,
        type: "equation",
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

export default LogarithmFormulas;

import React from "react";
import MetaTags from "../SEO/MetTags";
import Notes from "../Common/Notes";

const SequencesAndSeries = () => {
  const content = {
    title: "Formula Sheet",
    description: [
      {
        value: `SEQUENCE & SERIES`,
        type: "h4",
      },
      {
        value: ` ARITHMETIC PROGRESSION (AP) : `,
        type: "h6",
      },
      {
        value: `AP is sequence whose terms increase or decrease by a fixed number. 
        This fixed number is called the <b>common difference.</b> If 'a' is the 
        first term & 'd' is the common difference, then AP can be written as 
        `,
        type: "span",
      },
      "br",
      {
        value: `a, a + d, a + 2d, .............. a + (n - 1) d , ..... .. .. . `,
        type: "span",
      },
      "br",
      {
        value: `<b>(a)</b>  n<sup>th</sup> term of this  AP  |T<sub>n</sub>=a+(n-1)d|, where d = T<sub>n</sub> - T<sub>n-1</sub>`,
        type: "span",
      },
      "br",
      {
        value: `\\bold{(b)} The\\space sum\\space of\\space the\\space first\\space n\\space terms:\\space S_n =|{n\\above{1pt}2} [2a+(n-1)d]{n\\above{1pt}2}[a+l]|`,
        type: "equation",
      },
      {
        value: `where e is the last term.`,
        type: "span",
      },
      "br",
      {
        value: `\\bold{(C)}A1so\\space nb^th\\space term\\space |T_n=sn-S_n-l|`,
        type: "equation",
      },
      {
        value: ``,
        type: "span",
      },
      {
        value: `\\bold{Note:}`,
        type: "equation",
      },

      {
        value: `<b>(i)</b>Sum of first n terms of an AP. is of the form An<sup>2</sup> + Bn  i.e.  a 
        quadratic expression in n, in such case the common difference 
        is twice the coefficient of n<sup>2</sup>. i.e. 2A `,
        type: "span",
      },
      "br",
      {
        value: `<b>(ii)</b> n<sup>th</sup> term of an A.P. is of the form An + B i.e. a linear expression 
        in n, in such case the coefficient of n is the common difference 
        of the AP. i.e. A  `,
        type: "span",
      },
      "br",
      {
        value: `<b>(iii)</b> Three numbers in AP can be taken as a - d, a, a + d; four 
        numbers in AP can be taken as a - 3d, a - d, a + d, a + 3d 
        five numbers in AP are a - 2d, a - d, a, a + d, a + 2d & six 
        terms in AP are a - Sd, a - 3d, a - d, a + d, a + 3d, a + Sd etc.`,
        type: "span",
      },
      "br",
      {
        value: `<b>(iv)</b> If for A.P p<sup>th</sup> term is q,q<sup>th</sup>  term is p, then r<sup>th</sup> term is = p + q - r &   (p + q)<sup>th</sup> term is O.`,
        type: "span",
      },
      "br",
      {
        value: `<b>(v)</b> If a<sub>1</sub>,a<sub2</sub>,a<sub>3</sub>, ....... and b<sub>1</sub> , b<sub>2</sub> b<sub>3</sub> ........ . are two A.P.s, then 
        a<sub>1</sub> ± b<sub>1</sub> , a<sub>2</sub>, ± b<sub>2</sub> , a<sub>3</sub> ± b<sub>3</sub> ......... are also in AP. `,
        type: "span",
      },
      "br",
      {
        value: `<b>(vi)</b><br><b>(a)</b> If each term of an AP. is increased or decreased by the 
        same number, then the resulting sequence is also an A.P. 
        having the same common difference.`,
        type: "span",
      },
      "br",
      {
        value: `<b>(b)</b> If each term of an A P. Is multiplied or divided by the same 
        non zero number (k), then the resulting sequence is also an 
        AP. whose common difference is kd &`,
        type: "span",
      },
      {
        value: `{d\\above{1pt}k} \\space respectively,\\space 
        where\\space d\\space is\\space common\\space difference\\space of\\space original\\space AP. `,
        type: "equation",
      },
      {
        value: `<b>(vii)</b> Any term of an AP (except the first & last) is equal to half the 
        sum of terms which are equidistant from it. `,
        type: "span",
      },
      {
        value: `T_r ={T_r-k + T_r+k \\above{1pt}2},
        \\space k < r`,
        type: "equation",
      },
      {
        value: `GEOMETmC PROGRESSION (Gp) : `,
        type: "h6",
      },
      {
        value: `GP is a sequence of numbers whose first term is non-zero & each of 
        the succeeding terms Is equal to the preceeding terms multiplied by 
        a constant. Thus in a GP the ratio of successive terms Is constant.  `,
        type: "span",
      },
      "br",
      {
        value: ` This constant factor is called the <b>COMMON RATIO</b> of the series & 
        is obtained by dividing any term by the immediately previous term. `,
        type: "span",
      },
      {
        value: `Therefore\\space a,\\space ar,\\space ar^2 ,\\space ar^3 ,\\space ar^4 , .. .. ...... is\\space a\\space GP\\space with\\space 'a'\\space as\\space the\\space first\\space 
        term \\&\\space 'r'\\space as\\space common\\space ratio.  `,
        type: "equation",
      },
      {
        value: `\\bold{(a)}\\space n^{th}\\space term\\space |T_n =a r^{n-1}| `,
        type: "equation",
      },
      {
        value: `\\bold{(b)}\\space Sum\\space 0\\space the\\space first\\space n\\space terms\\space    s_n\\space = {a(r^n-1)\\above{1pt}r-1},\\space if\\space r \\not =`,
        type: "equation",
      },
      {
        value: `<b>(c)</b> Sum of infin,ite GP when | r |< 1  &  n  ->  ∞ , r<sup>n</sup>  -> 0`,
        type: "span",
      },
      {
        value: `\\bigg | S\\infty = {a\\above{1pt}1-r};|r| < 1 \\bigg|`,
        type: "equation",
      },
      {
        value: `<b>(d)</b>  Any 3 consecutive terms of a GP can be taken as `,
        type: "span",
      },
      {
        value: `{a\\above{1pt}r},\\space a,\\space ar; `,
        type: "equation",
      },
      {
        value: ` `,
        type: "span",
      },
      {
        value: `<b>(e)</b> If a, b, c are In GP ⇒ b<sup>2</sup> = ac ⇒ loga, 1ogb, logc, are in A.P. `,
        type: "span",
      },
      {
        value: `\\bold{Note:} `,
        type: "equation",
      },
      {
        value: `<b>(i)</b> In an G.P. product of k<sup>th</sup> term from beginning and k<sup>th</sup> term from 
        the last is always constant which equal to product of first term 
        and last term. `,
        type: "span",
      },
      "br",
      {
        value: `\\bold{(ii)}\\space Three\\space numbers\\space in\\space \\bold{G.P.}\\space : {a\\above{1pt}r},a,ar`,
        type: "equation",
      },
      {
        value: `Five\\space numbers\\space in\\space \\bold{G.P.}\\space :\\space{a\\above{1pt}r_2},{a{1pt}r},a,ar,ar^2`,
        type: "equation",
      },

      {
        value: `Four\\space numbers\\space in\\space  \\bold{G.P.} : {a\\above{1pt}r^3},{a\\above{1pt}r},ar,{a\\above{1pt}r^3}`,
        type: "equation",
      },

      {
        value: `Six\\space numbers\\space in\\space  \\bold{G.P.}\\space \\space :\\space {a\\above{1pt}r^5},{a\\above{1pt}r^3},{a\\above{1pt}r},ar,{a\\above{1pt}r^3},{a\\above{1pt}r^5}`,
        type: "equation",
      },
      {
        value: ` <b>(iii)</b> If each term of a <b>G.P.</b> be raised to the same power. then resulting 
        series is also a <b>G.P.</b> `,
        type: "span",
      },
      "br",
      {
        value: ` <b>(iv)</b> If each term of a G.P. be multiplied or divided by the same 
        non-zero quantity, then the resulting sequence is also a G.P.  `,
        type: "span",
      },
      "br",
      {
        value: `\\bold{(v)} If\\space a_1,\\space a_2,\\space a_3\\space .....\\space and\\space b_{1'},\\space b_{2'}\\space  b_{3'}\\space  .... .. . be\\space two\\space G.P.\\space 's\\space of\\space common\\space 
        ratio\\space   `,
        type: "equation",
      },

      {
        value: ` r_1\\space and\\space r_2\\space respectively,\\space then\\space a_1\\space b_1,\\space a_2,\\space b_2,\\space ..... and\\space 
        {a \\above{1pt}1}\\space, {a_2\\above{1pt}a_2}\\space, {a_3\\above{1pt}b_3}\\space ...........`,
        type: "equation",
      },

      {
        value: ` Will\\space also\\space form\\space a\\space G.P.\\space common\\space ratio\\space Will\\space be\\space r_ 1 r_2\\space and\\space {r1\\above{1pt}r2}\\space respectively.`,
        type: "equation",
      },
      "br",
      {
        value: `<b>(vi)</b> In a positive G.P. every term (except first) is equal to square root 
        of product of its two terms which are equidistant from it. 
         `,
        type: "span",
      },
      "br",
      {
        value: `i.e\\space T_r=\\sqrt{T_r-kT_r+k},k<r `,
        type: "equation",
      },
      {
        value: `(vii) If <b>a<sub>1</sub> , a<sub>2</sub>, a<sub>3</sub>,a<sub>n</sub></b> is a <b>G.P.</b> of <b>non zero, non negative terms,</b> 
        then <b>log a<sub>1</sub> log a<sub>2</sub>,log ...... a<sub>n</sub> </b> is an A.P. and vice-versa. `,
        type: "span",
      },

      "br",
      {
        value: `HARMONIC PROGRESSION (HP) :`,
        type: "h6",
      },
      {
        value: `A sequence is said to HP if the reciprocals of its terms are in AP. If the sequence  `,
        type: "span",
      },
      "br",
      {
        value: ` a<sub>1</sub>, a<sub>2</sub> ,a<sub>3</sub>,  ............., a<sub>n</sub> is an HP then  `,
        type: "span",
      },
      "br",
      {
        value: `{1\\above{1pt}a_2},.......,{1\\above{1pt}a_n}\\space is\\space an\\space AP\\space \\&\\space converse.\\space`,
        type: "equation",
      },

      {
        value: ` Here\\space we\\space do\\space not\\space have\\space the\\space formula\\space for\\space the\\space sum\\space of\\space the\\space n\\space terms\\space of\\space an\\space HP.  `,
        type: "equation",
      },
      {
        value: ` \\space The\\space general\\space form\\space of\\space a\\space harmonic\\space progression\\space is\\space {1\\above{1pt}a},\\space {1\\above{1pt}a+d},\\space {1\\above{1pt}a+(n-1)d}`,
        type: "equation",
      },
      "br",
      {
        value: `\\bold{Note:} `,
        type: "equation",
      },
      {
        value: ` No term of any H.P. can be zero. If a, b, c are in 
        HP   `,
        type: "span",
      },
      "br",
      {
        value: ` ⇒ b={2ac\\above{1pt}a+c}\\space or\\space {a\\above{1pt}c} = {a-b\\above{1pt}b-c} `,
        type: "equation",
      },
      {
        value: `4. MEANS  `,
        type: "h6",
      },
      "br",
      {
        value: `<b>(a) Arithmetic mean (AM) : </b> `,
        type: "span",
      },
      "br",
      {
        value: `If three terms are in AP then the middle term is called the AM 
        between the other two. so if a. b. c are in AP. b is AM of a & c. `,
        type: "span",
      },
      "br",
      {
        value: `<b>n-arithmetic means between two numbers: </b> `,
        type: "span",
      },
      {
        value: `If a,b are any two given numbers & a, A<sub>1</sub>, A<sub>2</sub>, .......... A<sub>n</sub>.<br> 
        b are in AP then A<sub>1</sub>, A<sub>2</sub>, ... A<sub>n</sub>, b are then AM's between a & b.  `,
        type: "span",
      },
      "br",
      {
        value: ` then A<sub>1</sub> = a+b, A<sub>2</sub> = a + 2d ,......... A<sub>n</sub> = a + nd`,
        type: "span",
      },
      {
        value: ` where \\space d = {b-a\\above{1pt}n+1}`,
        type: "equation",
      },
      {
        value: `<b>Note: </b> `,
        type: "span",
      },
      "br",
      {
        value: ` Sum of n AM's inserted between a & b is equal to n times 
        n 
        the single AM between a & b i.e.  `,
        type: "span",
      },

      {
        value: `\\displaystyle\\sum_{r=1}^nA_r=nA\\space where\\space A\\space is\\space the\\space single\\space \\bold{AM}\\space between\\space a\\space \\&\\space b.   `,
        type: "equation",
      },
      "br",
      {
        value: `<b>(b) Geometric mean (GM) :</b> `,
        type: "span",
      },
      "br",
      {
        value: `If a. b. c are in GP. b is the GM between a & c.  `,
        type: "span",
      },
      "br",
      {
        value: `b^2 = ac, 
    \\space    therefore\\space b = \\sqrt{ac}\\space `,
        type: "equation",
      },
      "br",
      {
        value: `<b>n-geometric means between two numbers : </b> `,
        type: "span",
      },
      "br",
      {
        value: `If a. b are two given positive numbers & a. G<sub>1</sub>, G<sub>2</sub>, ........ G<sub>n</sub>, 
        b are in GP then G<sub>1</sub>, G<sub>2</sub>,. G<sub>3</sub> ,.......... G<sub>n</sub>, are n GMs between a & b. `,
        type: "span",
      },
      "br",
      {
        value: `G_1 = ar, G_2 =ar^2,........ G_n = ar^n, where r = ({b\\above{1pt}a})^{1\\above{1pt}n+1} `,
        type: "equation",
      },

      {
        value: ` <b>Note :</b>`,
        type: "span",
      },
      "br",
      {
        value: `The product of n GMs between a & b is equal to nth  
        power of the single GM between a & b i.e. `,
        type: "span",
      },
      "br",
      {
        value: `\\displaystyle \\pi_{r=1}^n  G_r = (G)^n\\space where\\space G\\space is\\space the\\space single\\space GM\\space between\\space a\\space \\&\\space b `,
        type: "equation",
      },
      "br",
      {
        value: `<b>(c) Harmonic mean (HM) :</b> `,
        type: "span",
      },
      "br",
      {
        value: `If a. b. c are in HP,then b is HM between a & c, then  `,
        type: "span",
      },
      "br",
      {
        value: `b={2ac\\above{1pt}a+c}. `,
        type: "equation",
      },

      "br",
      {
        value: `<b>Important note :</b> `,
        type: "span",
      },
      "br",
      {
        value: `<b>(i)</b>) If A. G. H. are respectively AM. GM. HM between two positive 
        number a & b then`,
        type: "span",
      },
      "br",
      {
        value: `(a) G<sub>2</sub>= AH (A, G, H constitute a GP)`,
        type: "span",
      },
      "br",
      {
        value: ` (b) A ≥ G ≥ H `,
        type: "span",
      },
      "br",
      {
        value: `(c) A = G = H ⇒ a = b `,
        type: "span",
      },

      "br",
      {
        value: `<b>(ii)</b> Let a<sub>1</sub> a<sub>2</sub> ...... ,a<sub>n</sub>, be n positive real numbers, then we define 
        their arithmetic mean (A), geometric mean (G) and harmonic  `,
        type: "span",
      },
      "br",
      {
        value: ` mean\\space (H)\\space as\\space A ={a_1+a_2+.......+a_n\\above{1pt}n} `,
        type: "equation",
      },
      "br",
      {
        value: `G = (a_1 a_2, ...... ... a_n) ^{1\\above{1pt}n}\\space and \\space H= {\\space\\space \\space \\space \\space \\space n\\above{1pt}\\bigg( {1\\above{1pt}a_1}  {1\\above{1pt}a_2}+ {1\\above{1pt}a_3}+ {1\\above{1pt}a_n}   \\bigg)} `,
        type: "equation",
      },
      "br",
      {
        value: `It can be shown that  A ≥ G ≥ H  Moreover equaUty holds at either 
        place if and only if  a<sub>1</sub> = a<sub>2</sub> = ........= a<sub>n</sub>`,
        type: "span",
      },

      "br",
      {
        value: `5. <b>ARITHMETICO - GEOMETRIC SERIES :</b> `,
        type: "h6",
      },

      "br",
      {
        value: `<b>Sum of First n terms of an Arithmetieo-Geometric Series :</b> `,
        type: "span",
      },
      "br",
      {
        value: `Let S_n ={a\\above{1pt}1-r} +{dr(1-r^{n-1})\\above{1pt}(1-r)^2}-{[a+(n-1)d]r^n\\above{1pt}1-r},r \\not =1  `,
        type: "equation",
      },
      {
        value: `<b>Sum to infinity :</b> `,
        type: "span",
      },
      "br",
      {
        value: `If |r| < 1 \\space \\& n\\rarr \\space \\infty \\space  then\\space Lim^n = 0 \\Rarr S_\\infty = 
        {a\\above{1pt}1-r} +  {dr\\above{1pt}(1-r)^2} `,
        type: "equation",
      },

      "br",
      {
        value: `6. SIGMA NOTATIONS  `,
        type: "h6",
      },
      "br",
      {
        value: `<b>Theorems</b> :`,
        type: "span",
      },
      "br",
      {
        value: `\\bold{(a)} \\displaystyle\\sum_{r=1}^n(a_r ± b_r) =\\displaystyle\\sum_{r=1}^n a_r  ± 
        \\displaystyle\\sum_{r=1}^n b_r
        `,
        type: "equation",
      },
      {
        value: `\\bold{(b)} \\displaystyle\\sum_{r=1}^n ka_r = \\displaystyle\\sum_{r=1}^n  a_r
        `,
        type: "equation",
      },
      {
        value: `\\bold{(c)} \\displaystyle\\sum_{r=1}^n k = nk ;\\space where\\space k\\space is\\space a\\space \\space constant.
        `,
        type: "equation",
      },
      "br",
      {
        value: `6. RESULTS`,
        type: "h6",
      },
      {
        value: `(a)  \\displaystyle\\sum_{r=1}^n r = {n(n+1)\\above{1pt}\\space \\space \\space \\space2 } (sum\\space of\\space the\\space first\\space n\\space natural\\space numbers) `,
        type: "equation",
      },

      {
        value: `(b)  \\displaystyle\\sum_{r=1}^n r^2 ={n(n+1)(2n+1)\\above{1pt}\\space \\space \\space \\space6 }(sum\\space of\\space the\\space squares\\space of\\space the\\space first\\space n\\space natural ) `,
        type: "equation",
      },
      {
        value: `(c)  \\displaystyle\\sum_{r=1}^n r^3 ={n^2(n+1)^2\\above{1pt}
        \\space \\space \\space \\space 4}=\\bigg[
          \\displaystyle\\sum_{r=1}^n\\biggr]^2 (sum\\space of\\space the\\space cubes\\space of\\space the\\space first\\space n\\space natural\\space numbers)  `,
        type: "equation",
      },
      {
        value: `(d)  \\displaystyle \\sum_{r=1}^n r^4=  {n\\above{1pt}30}\\space (n + 1)(2n + 1)(3n^2 + 3n -1)          `,
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

export default SequencesAndSeries;

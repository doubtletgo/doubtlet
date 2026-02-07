import React from "react";
import MetaTags from "../SEO/MetTags";
import Notes from "../Common/Notes";

const TrignometricEquation = () => {
  const content = {
    title: "Formula Sheet",
    description: [
      {
        value: `TRIGONOMETRIC EQUATION`,
        type: "h4",
      },
      {
        value: `1.TRIGONOMETRIC EQUATION`,
        type: "h6",
      },
      {
        value: `An equation involving one or more trigonometrical ratios of unknown
        angles is called a trigonometrical equation.`,
        type: "span",
      },
      {
        value: `2. SOLUTION OF TRIGONOMETRIC EQUATION`,
        type: "h6",
      },
      {
        value: `A value of the unknown angle which satisfies the given equations is
        called a solution of the trigonometric equation.`,
        type: "span",
      },
      "br",
      {
        value: `<b> (a) Principal solution :-</b>`,
        type: "span",
      },
      {
        value: `The solution of the trigonometric equation
        lying in the interval [0, 2π).`,
        type: "span",
      },
      "br",
      {
        value: `<b>(b) General solution :-</b>`,
        type: "span",
      },
      {
        value: `Since all the trigonometric functions are
        many one & periodic, hence there are infinite values of a for
        which trigonometric functions have the same value. All such
        possible values of a for which the given trigonometric function
        is satisfied is given by a general formula . Such a general formula
        is called general solutions of trigonometric equation.`,
        type: "span",
      },
      {
        value: `3. GENERAL SOLUTIONS OF SOME TRIGONOMETRIC EQUATIONS (TO BE REMEMBERED)`,
        type: "h6",
      },
      {
        value: `<b>(a)</b>  If sin θ = 0,then θ = nπ, n ∈ 1 (set of integers) </b>`,
        type: "span",
      },
      "br",
      {
        value: `\\bold{(b)}\\space If\\space cos\\space θ = 0,\\space then\\space θ =(2n+1)\\space {π\\above{1pt}2}n∈1`,
        type: "equation",
      },
      {
        value: `<b>(c)</b>  If tan θ = 0, then θ = nπ, n∈1 `,
        type: "span",
      },
      "br",
      {
        value: `<b>(d)</b>  If sin θ = sin α, then θ = nπ+(-1)<sup>n</sup>a where α ∈    `,
        type: "span",
      },
      {
        value: ` \\bigg[{-π\\above{1pt}2},{-π\\above{1pt}2}\\bigg],n∈1`,
        type: "equation",
      },
      {
        value: `<b>(e)</b> If cosθ = cos α, then θ = 2nπ ± α, n ∈ 1 ,α ∈ [0,π]`,
        type: "span",
      },
      "br",
      {
        value: `<b>(f)</b> If tan θ  = tan α, then θ = nπ + α, n ∈ 1, α ∈`,
        type: "span",
      },
      {
        value: `\\bigg({-π\\above{1pt}2},{-π\\above{1pt}2}\\bigg)`,
        type: "equation",
      },

      {
        value: `\\bold{(g)}\\space If\\space sin\\space θ = 1,\\space then\\space θ = 2nπ + {π\\above{1pt}2}=(4n+1)\\space{π\\above{1pt}2},\\space n\\space ∈\\space 1`,
        type: "equation",
      },
      "br",
      {
        value: `(h) If cos θ = 1 then  θ = 2nπ, n ∈ 1`,
        type: "span",
      },
      "br",
      {
        value: `<b>(i)</b> If sin<sup>2</sup>  θ =sin<sup>2</sup> α or tan<sup>2</sup> θ =tan<sup>2 </sup> α, then θ = nπ ± α, n ∈ 1`,
        type: "span",
      },

      "br",
      {
        value: `<b>(j)</b>For n  ∈ 1 , sin nπ = 0 and cos nπ =(-1)<sup>n</sup>, n ∈ 1`,
        type: "span",
      },
      "br",
      {
        value: `(k)cos nπ=(-1)<sup>n</sup>, n ∈ 1`,
        type: "span",
      },
      "br",
      {
        value: `\\bold{(l)}\\space If\\space n\\space is\\space an\\space odd\\space integer\\space then\\space sin\\space {nπ \\above{1pt}2}=(-1)^{n-1\\above{1pt}2},\\space cos \\space{nπ\\above{1pt}2}=0`,
        type: "equation",
      },
      {
        value: `\\bold{(m)}\\space sin\\bigg( {nπ\\above{1pt}2}+0\\bigg)\\space= (-1)^{ \\above{1pt}})^{n-1\\above{1pt}2} \\space cos θ ,\\space cos\\bigg( {nπ\\above{1pt}2}+0\\bigg)\\space = (-1)^{n+1\\above{1pt}2}\\space sin θ `,
        type: "equation",
      },
      "br",
      {
        value: `4.
        GENERAL SOLUTION OF EQUATION a cos a + b sin θ  = c :`,
        type: "h6",
      },
      {
        value: `∴ {a\\above{1pt}\\sqrt{a^2+b^2}} \\space sinθ +{b\\above{1pt}\\sqrt{a^2+b^2}}tan^{-1} +{b\\above{1pt}a}`,
        type: "equation",
      },

      {
        value: `equation\\space (i)\\space has\\space the\\space solution\\space only\\space if\\space |c|\\space \\leq \\sqrt{a^2+b^2}`,
        type: "equation",
      },
      {
        value: `let\\space {a\\above{1pt}\\sqrt{a^2+b^2}} \\space cos\\phi \\space {b\\above{1pt}\\sqrt{a^2+b^2}}=sin\\phi \\space \\&=tan^{-1}\\space {b\\above{1pt}a}   `,
        type: "equation",
      },

      {
        value: `by introducing this auxiliary argument $, equation (i) reduces to`,
        type: "span",
      },
      "br",
      {
        value: `sin\\(0+ ϕ)= `,
        type: "span",
      },
      "br",
      {
        value: ` { c\\above{ 1pt }\\sqrt{ a^2+b^2
        }} `,
        type: "equation",
      },
      {
        value: `Now this equation can be solved easily.`,
        type: "span",
      },
      {
        value: `5.GENERAL SOLUTION OF EQUATION OF FORM:`,
        type: "h6",
      },
      {
        value: `a_0 \\space sin^n x+a_1 sin^{n-2}x\\space \\space cosx +a_2 sin^{n-2}x cos^2x + .........+ a_n cos^nx =0`,
        type: "equation",
      },
      {
        value: `a<sub>0</sub>,a<sub>1</sub>..........a<sub>n</sub>are real numbers`,
        type: "span",
      },
      "br",
      {
        value: `Such an equation is solved by dividing equation by cos<sup>n</sup>x.`,
        type: "span",
      },
      {
        value: `6.IMPORTANT TIPS :`,
        type: "h6",
      },
      {
        value: `<b>(a)</b>For equations of the type sin θ = k or cos θ = k, `,
        type: "span",
      },
      {
        value: ` one\\space must\\space check\\space
        that\\space | k | \\leq \\space 1.`,
        type: "equation",
      },
      {
        value: `<b>(b)</b>Avoid squaring the equations, if possible, because It may lead
        to extraneous solutions .`,
        type: "span",
      },
      "br",
      {
        value: `<b>(c)</b>Do not cancel the common variable factor from the two sides of
        the equations which are In a product because we may loose
        some solutions.`,
        type: "span",
      },
      "br",
      {
        value: `<b>(d)</b>The answer should not contain such values of
        any of the terms undefined or Infinite.
        θ, which make`,
        type: "span",
      },
      "br",
      {
        value: `<b>(e)</b>Check that denominator is not zero at any stage while solving
        equations.`,
        type: "span",
      },
      "br",
      {
        value: `<b>(f)</b><b>(i)</b>If tan e or sec e is involved In the equations,`,
        type: "span",
      },
      "br",
      {
        value: ` θ,should\\space not\\space be\\space
        odd\\space multiple\\space of\\space {π \\above{1pt}n} `,
        type: "equation",
      },
      "br",
      {
        value: `<b>(ii)</b>If cot θ or cosec  θ is involved In the equation, θ should not be
        integral multiple of π or O.`,
        type: "span",
      },
      "br",
      {
        value: `<b>(g)</b> If two different trigonometric ratios such as tan
        θ  and sec  θ  are
        Involved then after soMng we cannot apply the usual formulae
        for general solution because periodicity of the functions are not
        same. `,
        type: "span",
      },

      "br",
      {
        value: `<b>(h)</b>If L.H.S. of the given trigonometric equation Is always less than
        or equal to k and RHS Is always greaier than k, then no solution
        exists.`,
        type: "span",
      },
      "br",
      {
        value: `If both the sides are equaJ to k for same value of  θ , then
        solution exists and If they are equal for different value of  θ , then
        solution does not exist.`,
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

export default TrignometricEquation;

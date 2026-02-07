import React from 'react';
import MetaTags from "../SEO/MetTags"
import Notes from "../Common/Notes";

const TrignometricRatio = () => {


  const content = {
    title: "Formula Sheet",
    description: [
      {
        value: `TRIGNOMETRIC RATIOS & IDENTITIES`,
        type: "h4"
      },
      {
        value: `(1) RELATION BETWEEN SYSTEM OF MEASUREMENT OF ANGLES:`,
        type: "h6"
      },
      {
        value: `{D \\above{1pt} 90} = {G \\above{1pt} 100} = {2C \\above{1pt} \\pi}`,
        type: "equation"
      },
      {
        value: `1 \\space Radian = {180 \\above{1pt} \\pi} degree \\approx 57\\degree17'15"(approximately)`,
        type: "equation"
      },
      {
        value: `1 \\space degree = {\\pi \\above{1pt} 180} radian \\approx 0.0175 \\space radian`,
        type: "equation"
      },
      {
        value: `(2) BASIC lRIGONOMElRIC IDENTITIES:`,
        type: "h6"
      },
      {
        value: `(a) \\enspace sin^2 \\theta + cos^2 \\theta = 1 \\space or \\space sin^2 \\theta = 1 - cos^2 \\theta 
        \\space or \\space cos^2 \\theta = 1 - sin^2 \\theta`,
        type: "equation"
      },
      {
        value: `(b) \\enspace sec^2 \\theta - tan^2 \\theta = 1 \\space or\\space sec^2 \\theta = 1 + tan^2 \\theta 
        \\space or \\space tan^2 \\theta = sec^2 \\theta - 1`,
        type: "equation"
      },
      {
        value: `(c) \\enspace If \\space sec\\theta + tan\\theta = k \\implies sec\\theta - tan\\theta = {1 \\above{1pt} k} \\implies
        2 sec \\theta = k + {1 \\above{1pt} k}`,
        type: "equation"
      },
      {
        value: `(d) \\enspace cosec^2 \\theta - cot^2 \\theta = 1 \\space or \\space cosec^2\\theta = 1 + cot^2\\theta
        \\space or \\space cot^2 \\theta = cosec^2 \\theta`,
        type: "equation"
      },
      {
        value: `(e) \\enspace If \\space cosec \\theta + cot \\theta = k \\implies cosec \\theta - cot \\theta = {1 \\above{1pt} k} \\implies
        2 cosec\\theta = k + {1 \\above{1pt} k}`,
        type: "equation"
      },
      {
        value: `(3) SIGNS OF TRIGONOMETRlC FUNCTIONS IN DIFFERENT QUADRANTS :`,
        type: "h6"
      },
      {
        src: "/images/notesImages/SignOfQuadrant.png",
        type: "img",
        alt: "Area Of Equilateral Triangle Image 1"
      },
      {
        value: `(4) TRIGONOMETRIC FUNCTIONS OF ALLIED ANGLES :`,
        type: "h6"
      },
      {
        value: `(a) \\enspace sin (2n\\pi + \\theta) = sin \\theta, cos (2n\\pi + \\theta) = cos \\theta, where \\space n \\space  {\\large \\epsilon} \\space  I`,
        type: "equation"
      },
      {
        value: `(b) \\enspace \\begin{array}{cc}
        sin (-\\theta) = - sin \\theta & \\enspace cos (-\\theta) = cos \\theta \\\\
        sin(90° - \\theta) = cos\\theta & \\enspace cos(90° - \\theta) = sin\\theta \\\\
        sin(90° + \\theta) = cos\\theta & \\enspace cos(90° + \\theta) = -sin\\theta \\\\
        sin(180° - \\theta) = sin\\theta & \\enspace cos(180° - \\theta) = -cos\\theta \\\\
          sin(180° + \\theta) = -sin\\theta & \\enspace cos(180° + \\theta) = -cos\\theta \\\\
            sin(270° - \\theta) = -cos\\theta & \\enspace cos(270° - \\theta) = -sin\\theta \\\\
              sin(270° + \\theta) = -cos\\theta & \\enspace cos(270° + \\theta) = sin\\theta

     \\end{array}`,
        type: "equation"
      },
      {
        value: `<b>Note:</b>`,
        type: "span"
      },
      {
        value: `(i) \\enspace sin \\space n\\pi = 0; \\space cos \\space n\\pi = (-1)^n; \\space tan \\space n\\pi = 0 \\space where 
        \\space n \\space {\\large \\epsilon} \\space I`,
        type: "equation"
      },
      {
        value: `(ii) \\enspace sin(2n + 1) {\\pi \\above{1pt}2} = (-1)^n; \\space cos(2n + 1){{\\pi \\above{1pt}2}} = 0 \\space where 
        \\space n \\space {\\large \\epsilon} \\space I`,
        type: "equation"
      },
      {
        value: `(5) IMPORTANT TRIGNOMETRIC FORMULAE:`,
        type: "h6"
      },
      {
        value: `(i) \\enspace sin(A + B) = sin A \\space cos B + cos A \\space sin B`,
        type: "equation"
      },
      {
        value: `(ii) \\enspace sin(A - B) = sin A \\space cos B - cos A \\space sin B`,
        type: "equation"
      },
      {
        value: `(iii) \\enspace cos(A + B) = cos A \\space cos B - sin A \\space sin B`,
        type: "equation"
      },
      {
        value: `(iv) \\enspace cos(A - B) = cos A \\space cos B + sin A \\space sin B`,
        type: "equation"
      },
      {
        value: `(v) \\enspace tan(A+B) = {tanA + tanB \\above{1pt} 1- tan A \\space tan B}`,
        type: "equation"
      },
      {
        value: `(vi) \\enspace tan(A-B) = {tanA - tanB \\above{1pt} 1 + tan A \\space tan B}`,
        type: "equation"
      },
      {
        value: `(vii) \\enspace cot(A+B) = {cot B cot A - 1 \\above{1pt} cot B - cot A}`,
        type: "equation"
      },
      {
        value: `(viii) \\enspace cot(A-B) = {cot B cot A + 1 \\above{1pt} cot B - cot A}`,
        type: "equation"
      },
      {
        value: `(ix) \\enspace 2 \\space sin A \\space cos B = sin (A+B) + sin(A-B)`,
        type: "equation"
      },
      {
        value: `(x) \\enspace 2 \\space cos A \\space sin B = sin (A+B) - sin(A-B)`,
        type: "equation"
      },
      {
        value: `(xi) \\enspace 2 \\space cos A \\space cos B = cos (A+B) + cos(A-B)`,
        type: "equation"
      },
      {
        value: `(xii) \\enspace 2 \\space sin A \\space sin B = cos (A-B) - cos(A+B)`,
        type: "equation"
      },
      {
        value: `(xiii) \\enspace sin C + sin D = 2 sin \\bigg({C+D\\above{1pt}2}\\bigg)cos \\bigg({C-D\\above{1pt}2}\\bigg)`,
        type: "equation"
      },
      {
        value: `(xiv) \\enspace sin C - sin D = 2 cos \\bigg({C+D\\above{1pt}2}\\bigg)sin \\bigg({C-D\\above{1pt}2}\\bigg)`,
        type: "equation"
      },
      {
        value: `(xv) \\enspace cos C + cos D = 2 cos \\bigg({C+D\\above{1pt}2}\\bigg)cos \\bigg({C-D\\above{1pt}2}\\bigg)`,
        type: "equation"
      },
      {
        value: `(xvi) \\enspace cos C - cos D = 2 sin \\bigg({C+D\\above{1pt}2}\\bigg)sin \\bigg({D-C\\above{1pt}2}\\bigg)`,
        type: "equation"
      },
      {
        value: `(xvii) \\enspace sin 2\\theta = 2 \\space sin \\theta \\space cos \\theta = {2tan\\theta \\above{1pt} 1 + tan^2 \\theta}`,
        type: "equation"
      },
      {
        value: `(xviii) \\enspace cos2\\theta = cos^2 \\theta - sin^2 \\theta = 2cos^2 \\theta - 1 = 1 - 2 \\space sin^2 \\theta
        = {1-tan^2 \\theta \\above{1pt} 1 + tan^2 \\theta}`,
        type: "equation"
      },
      {
        value: `(xix) \\enspace 1 + cos 2 \\theta = 2 cos^2 \\theta \\space or \\space cos \\theta = \\plusmn 
        \\sqrt{1 + cos 2\\theta \\above{1pt} 2}`,
        type: "equation"
      },
      {
        value: `(xx) \\enspace 1 - cos 2 \\theta = 2 sin^2 \\theta \\space or \\space sin \\theta = \\plusmn 
        \\sqrt{1 - cos 2\\theta \\above{1pt} 2}`,
        type: "equation"
      },
      {
        value: `(xxi) \\enspace tan\\theta = {1 - cos2 \\theta \\above{1pt} sin2 \\theta} = {sin2 \\theta \\above{1pt} 1 + cos2 \\theta}
        = \\plusmn \\sqrt{1-cos2\\theta \\above{1pt} 1 + cos 2 \\theta}`,
        type: "equation"
      },
      {
        value: `(xxii) \\enspace tan 2 \\theta = {2tan\\theta \\above{1pt} 1 - tan^2 \\theta}`,
        type: "equation"
      },
      {
        value: `(xxiii) \\enspace sin 3 \\theta = 3 sin \\theta - 4 sin^3 \\theta`,
        type: "equation"
      },
      {
        value: `(xxiv) \\enspace cos 3 \\theta = 4 cos^3 \\theta - 3 cos \\theta`,
        type: "equation"
      },
      {
        value: `(xxv) \\enspace tan 3 \\theta = {3 tan \\theta - tan^3 \\theta \\above{1pt} 1 - 3 tan^2 \\theta}`,
        type: "equation"
      },
      {
        value: `(xxvi) \\enspace sin^2 A - sin^2 B = sin (A+B). sin(A+B) = cos^2 B - cos^2 A`,
        type: "equation"
      },
      {
        value: `(xxvii) \\enspace cos^2 A - sin^2 B = cos(A+B). cos(A+B)`,
        type: "equation"
      },
      {
        value: `(xxviii) \\enspace sin(A+B+C) =sinA cosB cosC + sinB cosA cosC + sinC cosA cosB - sinA sinB sinC`,
        type: "equation"
      },
      {
        value: `=  \\Sigma sinA \\space cosB \\space cosC - {\\Large\\pi} sin A`,
        type: "equation"
      },
      {
        value: `= cosA \\space cosB \\space cosC \\space [tanA + tanB + tanC - tanA \\space tanB \\space tanC]`,
        type: "equation"
      },
      {
        value: `(xxix) \\enspace cos(A+B+C) = cosA \\space cosB \\space cosC - sinA \\space sinB \\space cosC - sinA \\space cosB \\space sinC
        - cosA \\space sinB \\space sinC`,
        type: "equation"
      },
      {
        value: `(xxx) \\enspace tan(A+B+C)`,
        type: "equation"
      },
      {
        value: `= {tanA + tanB + tanC - tanA \\space tanB \\space tanC \\above{1pt} 1 - tanA \\space tanB - tanC\\space tanA} = 
        {S_1 - S_3 \\above{1pt} 1 - S_2}`,
        type: "equation"
      },
      {
        value: `(xxxi) \\enspace sin \\alpha + sin(\\alpha + \\beta) + sin (\\alpha + \\overline{n-1} \\beta)`,
        type: "equation"
      },
      {
        value: `= {sin \\bigg \\lbrace \\alpha + \\bigg({n-1 \\above{1pt} 2}\\bigg) \\beta \\bigg \\rbrace sin \\bigg({n \\beta \\above{1pt}2} \\bigg)
      \\above{1pt} {sin\\bigg({\\beta \\above{1pt}2} \\bigg)}}`,
        type: "equation"
      },
      {
        value: `(xxxii) \\enspace  cos \\alpha + cos (\\alpha + \\beta) + cos (\\alpha + 2 \\beta) +........ + cos(\\alpha + \\overline{n-1}\\beta)`,
        type: "equation"
      },
      {
        value: `= {cos \\bigg \\lbrace \\alpha + \\bigg ({n-1 \\above{1pt} 2}\\bigg)\\beta \\bigg \\rbrace sin \\bigg ({n\\beta \\above{1pt}2} \\bigg) 
      \\above{1pt} sin \\bigg ({\\beta \\above{1pt} 2} \\bigg)}`,
        type: "equation"
      },
      {
        value: `(6) VALUES OF SOME T-RATIOS FOR ANGLES 18°, 36°, 15°, 22.5°,67.5° etc.`,
        type: "h6"
      },
      {
        value: `(a) \\enspace sin 18 \\degree = {\\sqrt{5} - 1 \\above{1pt} 4} = cos 72\\degree = sin {\\pi \\above{1pt} 10}`,
        type: "equation"
      },
      {
        value: `(b) \\enspace cos 36 \\degree = {\\sqrt{5} + 1 \\above{1pt} 4} = sin 54\\degree = cos {\\pi \\above{1pt} 5}`,
        type: "equation"
      },
      {
        value: `(c) \\enspace sin 15\\degree = {\\sqrt{3}  - 1 \\above{1pt} 2 \\sqrt{2}} = cos 75 \\degree = sin {\\pi \\above{1pt} 12}`,
        type: "equation"
      },
      {
        value: `(d) \\enspace cos 15 \\degree = {\\sqrt{3} + 1 \\above{1pt} 2{\\sqrt{2}}} = 75 \\degree = cos {\\pi \\above{1pt} 12}`,
        type: "equation"
      },
      {
        value: `(e) \\enspace tan {\\pi \\above{1pt} 12} = 2 - \\sqrt{3} = {\\sqrt{3} - 1 \\above{1pt} \\sqrt{3} + 1} = cot {5\\pi \\above{1pt} 12}`,
        type: "equation"
      },
      {
        value: `(f) \\enspace tan {5\\pi \\above{1pt} 12} = 2 + \\sqrt{3} = {\\sqrt{3} + 1 \\above{1pt} \\sqrt{3} - 1} = cot {\\pi \\above{1pt} 12}`,
        type: "equation"
      },
      {
        value: `(g) \\enspace tan(225\\degree) = \\sqrt{2} - 1 = cot(67.5\\degree) = cot{3\\pi \\above{1pt} 8} = tan {\\pi \\above{1pt} 8}`,
        type: "equation"
      },
      {
        value: `(h) \\enspace tan(67.5 \\degree) = \\sqrt{2} + 1 = cot(22.5\\degree)`,
        type: "equation"
      },
      {
        value: `(7) MAXIMUM & MINIMUM VALUES OF TRIGONOMETRIC EXPRESSIONS :`,
        type: "h6"
      },
      {
        value: `(a) \\enspace a \\space cos \\theta + b \\space sin \\theta \\space will \\space always \\space lie \\space in 
        \\space the \\space interval \\space [- \\sqrt{a^2 + b^2}, \\sqrt{a^2 + b^2} ] \\space i.e.`,
        type: "equation"
      },
      {
        value: `the \\space
        maximum \\space and \\space minimum \\space values \\space are \\space \\sqrt{a^2 + b^2}, 
        -\\sqrt{a^2 + b^2} \\space respectively`,
        type: "equation"
      },
      {
        value: `(b) \\enspace Minimum \\space value \\space of \\space a^2 tan^2 \\theta + b^2 cot^2 \\theta
         = 2ab, where \\space a, b > 0`,
        type: "equation"
      },
      {
        value: `(c) \\enspace -\\sqrt{a^2 + b^2 + 2ab \\space cos(\\alpha - \\beta)} \\leq a \\space cos (a + \\theta) + 
        b \\space cos (\\beta + \\theta)`,
        type: "equation"
      },
      {
        value: `\\leq \\sqrt{a^2 + b^2 + 2ab \\space cos(\\alpha - \\beta)} \\space where \\space \\alpha \\space 
        and \\space \\beta \\space are \\space known \\space angles.`,
        type: "equation"
      },
      {
        value: `(d) \\enspace Minimum \\space value \\space of \\space a^2 cos^2 \\theta + b^2 sec^2 \\theta \\space 
        is \\space either \\space 2ab \\space or \\space a^2 + b^2, 
        `,
        type: "equation"
      },
      {
        value: `if \\space for \\space some \\space real \\space \\theta equation \\space a \\space cos\\theta
         = b \\space sec \\theta  \\space is \\space true \\space or \\space not \\space true 
        \\lbrace a, b > 0 \\rbrace`,
        type: "equation"
      },
      {
        value: `(e) \\enspace  Minimum \\space value \\space of \\space a^2 sin^2 \\theta + b^2cosec^2 \\theta
        \\space is \\space either \\space 2ab \\space or \\space a^2 + b^2,`,
        type: "equation"
      },
      {
        value: `if \\space for \\space some \\space real \\space \\theta \\space equation \\space a \\space sin\\theta =
         b \\space cosec \\theta \\space is \\space true \\space or \\space not \\space true \\space 
         \\lbrace a, \\space b > 0 \\rbrace`,
        type: "equation"
      },
      {
        value: `(8) IMPORTANT RESULTS:`,
        type: "h6"
      },
      {
        value: `(a) \\enspace sin \\theta \\space sin(60\\degree - \\theta) sin (60\\degree + \\theta) = 
        {1 \\above{1pt} 4} sin 3 \\theta`,
        type: "equation"
      },
      {
        value: `(b) \\enspace cos \\theta. \\space cos(60\\degree - \\theta) cos(60\\degree + \\theta) = 
        {1 \\above{1pt}4} cos 3 \\theta`,
        type: "equation"
      },
      {
        value: `(c) \\enspace tan \\theta \\space tan(60\\degree - \\theta)tan(60\\degree + \\theta) = 
        tan 3\\theta`,
        type: "equation"
      },
      {
        value: `(d) \\enspace cot \\theta \\space cot(60\\degree - \\theta)cot(60\\degree + \\theta) = 
        cot 3\\theta`,
        type: "equation"
      },
      {
        value: `(e) \\space (i) \\enspace sin^2 \\theta + sin^2 (60\\degree - \\theta) = {3 \\above{1pt} 2}`,
        type: "equation"
      },
      {
        value: `(ii) \\enspace cos^2 \\theta + cos^2 (60\\degree - \\theta) = {3 \\above{1pt} 2}`,
        type: "equation"
      },
      {
        value: `(f) \\space (i)\\enspace If \\space tan \\space A + tan \\space B + tan \\space C = 
        tan \\space A \\space tan \\space B \\space tan \\space C,`,
        type: "equation"
      },
      {
        value: `then \\space A + B + C = n \\pi, n \\space \\epsilon \\space I`,
        type: "equation"
      },
      {
        value: `(ii)\\enspace If \\space tan \\space A \\space tan \\space B + tan \\space B \\space tan \\space C +
        tan \\space C \\space tan \\space A = 1`,
        type: "equation"
      },
      {
        value: `then \\space A + B + C = (2n + 1) {\\pi \\above{1pt} 2}, n \\space \\epsilon \\space I`,
        type: "equation"
      },
      {
        value: `(g) \\enspace cos \\theta \\space cos 2\\theta \\space cos 4\\theta........cos(2^{n-1} \\theta) = 
        {sin(2^n \\theta) \\above{1pt}2^n sin \\theta}`,
        type: "equation"
      },
      {
        value: `(h) \\enspace cotA - tanA = 2cot2A`,
        type: "equation"
      },
      {
        value: `(9) CONDITIONAL IDENTITIES:`,
        type: "h6"
      },
      {
        value: `<b>If A + B + C = 180°, then</b>`,
        type: "span"
      },
      {
        value: `(a) \\enspace tanA + tanB + tanC = tan A \\space tan B \\space tan C`,
        type: "equation"
      },
      {
        value: `(b) \\enspace cotA \\space cotB + cotB \\space cotC + cotC \\space cotA = 1`,
        type: "equation"
      },
      {
        value: `(c) \\enspace tan{A \\above{1pt}2} \\space tan{B \\above{1pt}2} + tan{B \\above{1pt}2} \\space tan{C \\above{1pt}2} 
        + tan{C \\above{1pt}2} \\space tan{A \\above{1pt}2} = 1`,
        type: "equation"
      },
      {
        value: `(d) \\enspace cot{A \\above{1pt}2} + cot{B \\above{1pt}2} + cot{C \\above{1pt}2} = 
        cot{A \\above{1pt}2}\\space cot{B \\above{1pt}2} \\space cot{C \\above{1pt}2}`,
        type: "equation"
      },
      {
        value: `(e) \\enspace  sin 2A + sin 2B + sin 2C = 4 \\space sinA \\space sinB \\space sinC`,
        type: "equation"
      },
      {
        value: `(f) \\enspace cos 2A + cos 2B + cos 2C = -1-4 cosA \\space cosB \\space cosC`,
        type: "equation"
      },
      {
        value: `(g) \\enspace  sin A + sin B + sin C = 4 cos {A \\above{1pt} 2}cos {B \\above{1pt} 2}
        cos {C \\above{1pt} 2}`,
        type: "equation"
      },
      {
        value: `(h) \\enspace  cos A + cos B + cos C = 1 + 4 sin {A \\above{1pt} 2}sin {B \\above{1pt} 2}
        sin{C \\above{1pt} 2}`,
        type: "equation"
      },
      {
        value: `(10) DOMAINS, RANGES AND PERIODICITY OF TRIGNOMETRIC FUNCTIONS:`,
        type: "h6"
      },
      {
        value: `\\begin{array}{cc}
        \\bold{T-Ratio Domain} &  \\bold{Range} & \\bold{Period} \\\\
        sin \\space x \\qquad R & [-1, 1] & 2 \\pi \\\\
        cos \\space x \\qquad R & [-1, 1] & 2 \\pi \\\\
        tan \\space x \\qquad R-\\lbrace(2n-1){\\pi \\above{1pt}2}; n \\space \\epsilon \\space I\\rbrace & R &  \\pi \\\\
        cot \\space x \\qquad R-[n\\pi: n \\space \\epsilon \\space I] & R &  \\pi \\\\
        sec \\space x \\qquad R-\\lbrace(2n-1){\\pi \\above{1pt}2}; n \\space \\epsilon \\space I\\rbrace & (-\\infin, -1)\\cup(1, \\infin) &  2\\pi \\\\
        cosec \\space x \\qquad R-\\lbrace n\\pi : n \\space \\epsilon \\space I \\rbrace & (-\\infin, -1)\\cup(1, \\infin) & 2\\pi
     \\end{array}`,
        type: "equation"
      },
      {
        value: `(11) GRAPH OF TRIGONOMETRIC FUNCTIONS :`,
        type: "h6"
      },
      {
        value: `(a) \\enspace y = sin \\space x`,
        type: "equation"
      },
      {
        src: "/images/notesImages/sinX.png",
        type: "img",
        alt: "Area Of Equilateral Triangle Image 1"
      },
      {
        value: `(b) \\enspace y = cos \\space x`,
        type: "equation"
      },
      {
        src: "/images/notesImages/cosX.png",
        type: "img",
        alt: "Area Of Equilateral Triangle Image 1"
      },
      {
        value: `(c) \\enspace y = tan \\space x`,
        type: "equation"
      },
      {
        src: "/images/notesImages/tanX.png",
        type: "img",
        alt: "Area Of Equilateral Triangle Image 1"
      },
      {
        value: `(d) \\enspace y = cot \\space x`,
        type: "equation"
      },
      {
        src: "/images/notesImages/cotX.png",
        type: "img",
        alt: "Area Of Equilateral Triangle Image 1"
      },
      {
        value: `(e) \\enspace y = sec \\space x`,
        type: "equation"
      },
      {
        src: "/images/notesImages/secX.png",
        type: "img",
        alt: "Area Of Equilateral Triangle Image 1"
      },
      {
        value: `(f) \\enspace y = cosec \\space x`,
        type: "equation"
      },
      {
        src: "/images/notesImages/secX.png",
        type: "img",
        alt: "Area Of Equilateral Triangle Image 1"
      },
      {
        value: `(12) IMPORTANT NOTE:`,
        type: "h6"
      },
      {
        value: `(a) The sum of interior angles of a polygon of n-sides`,
        type: "span"
      },
      {
        value: `= (n - 2) \\space x \\space 180\\degree = (n-2)\\pi `,
        type: "equation"
      },
      {
        value: `(b) Each interior angle of a regular polygon of n sides`,
        type: "span"
      },
      {
        value: `= {(n-2) \\above{1pt} n} \\space x \\space 180\\degree = {(n-2) \\above{1pt} n}\\pi`,
        type: "equation"
      },
      {
        value: `(c) Sum of exterior angles of a polygon of any number of sides`,
        type: "span"
      },
      {
        value: `= 360 \\degree  = 2 \\pi`,
        type: "equation"
      }
    ]
  }

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
  )
}

export default TrignometricRatio;


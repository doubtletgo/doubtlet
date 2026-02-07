import AlgebraicPolynomialsMultiplication from '@/components/calculators/AlgebraicPolynomialsMultiplication';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: ' Algebraic polynomials multiplication Calculator | Doubtlet.com',
  description:
    'This calculator will help you to multiply two given algebraic polynomials with the steps shown.',
};

export default async function Page() {
  const headerList = headers();
  const pathname = headerList.get('x-current-path');
  const name = pathname.split('/')?.[2];

  const respNotes = await getNotesServerSide(name);

  return (
    <>
      <div className="container calculator-content text-center mb-5">
        <BreadCrumbs
          breadcrumbUrl1="/"
          breadcrumbText1="Home"
          breadcrumbUrl2="/subjects/"
          breadcrumbText2="Subjects"
          breadcrumbText3="Maths"
          breadcrumbUrl3="/calculator/math/"
          breadcrumbText4="Pre Calculus"
          breadcrumbUrl4="/calculator/pre-calculus/"
          breadcrumbText5="Polynomials"
          breadcrumbUrl5="/calculator/polynomial-operations/"
          breadcrumbText6="Multiplication"
          breadcrumbUrl6="/calculator/algebraic-polynomials-multiplication/"
        />
        <h1 className="text-primary">
          Algebraic polynomials multiplication Calculator
        </h1>
        <span>
          This calculator will help you to multiply two given algebraic
          polynomials with the steps shown.
          <br /> Related Calculators:
          <Button
            name="Polynomials addition or subtraction Calculator"
            url="/calculator/algebraic-polynomials-addition-subtraction/"
          />
          <Button
            name="Polynomial long division Calculator"
            url="/calculator/algebraic-polynomials-long-division/"
          />
        </span>
        <hr />
        <AlgebraicPolynomialsMultiplication />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}

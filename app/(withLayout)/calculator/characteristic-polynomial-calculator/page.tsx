import CharacteristicPolynomial from '@/components/calculators/CharacteristicPolynomial';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Characteristic Polynomial Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the characteristic polynomial of a matrix at a time with the steps shown.',
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
          breadcrumbText4="Linear Algebra"
          breadcrumbUrl4="/calculator/linear-algebra/"
          breadcrumbText5="Matrices"
          breadcrumbUrl5="/calculator/matrix-operations/"
          breadcrumbText6="Characteristic Polynomial"
          breadcrumbUrl6="/calculator/characteristic-polynomial-calculator/"
        />
        <h1 className="text-primary">Characteristic Polynomial Calculator</h1>
        <span>
          This calculator will help you to find the characteristic polynomial of
          a matrix at a time with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Eigenvalue and Eigenvector Calculator"
            url="/calculator/eigen-value-and-eigen-vector-calculator/"
          />
        </span>
        <hr />
        <CharacteristicPolynomial />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}

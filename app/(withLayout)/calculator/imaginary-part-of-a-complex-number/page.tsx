import ImaginaryPartOfAComplexNumber from '@/components/calculators/ImaginaryPartOfAComplexNumber';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Imaginary Part Of A Complex Numbers Calculator | Doubtlet.com',
  description:
    'This calculator will help you to Imaginary Part Of A Complex numbers Z (a + ib) at a time with steps shown.',
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
          breadcrumbText5="Complex Numbers"
          breadcrumbUrl5="/calculator/complex-numbers/"
          breadcrumbText6="Imaginary Part"
          breadcrumbUrl6="/calculator/imaginary-part-of-a-complex-number/"
        />
        <h1 className="text-primary">
          Imaginary Part Of A Complex Number Calculator
        </h1>
        <span>
          This calculator will help you to Imaginary Part Of A Complex numbers Z
          (a + ib) at a time with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Complex Number Real Part Calculator"
            url="/calculator/real-part-of-a-complex-number/"
          />
          <Button
            name="Complex Number Modulus Calculator"
            url="/calculator/modulus-of-a-complex-number/"
          />
        </span>
        <hr />
        <ImaginaryPartOfAComplexNumber />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}

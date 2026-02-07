import ModulusOfAComplexNumber from '@/components/calculators/ModulusOfAComplexNumber';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Modulus of a Complex number Calculator | Doubtlet.com',
  description:
    'This calculator will h­elp you to find the Modulus of a complex number Z(a + ib) with steps shown.',
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
          breadcrumbText6="Modulus"
          breadcrumbUrl6="/calculator/modulus-of-a-complex-number/"
        />
        <h1 className="text-primary">Modulus of a Complex number Calculator</h1>
        <span>
          This calculator will h­elp you to find the Modulus or Magnitude of a
          complex number z (a + ib) at a time with steps shown.
          <br />
          Related Calculators:
          <Button
            name="Complex Number Inverse Calculator"
            url="/calculator/inverse-of-a-complex-numbers/"
          />
          <Button
            name="Complex Number Conjugate Calculator"
            url="/calculator/conjugate-of-complex-number/"
          />
        </span>
        <hr />
        <ModulusOfAComplexNumber />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}

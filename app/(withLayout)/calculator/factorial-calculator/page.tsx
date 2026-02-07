import Factorial from '@/components/calculators/Factorial';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Factorial Calculator | Doubtlet.com',
  description:
    'This calculator will help you to calculate the factorial of a number with the steps shown.',
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
          breadcrumbText4="Pre Algebra"
          breadcrumbUrl4="/calculator/pre-algebra/"
          breadcrumbText5="Factorial"
          breadcrumbUrl5="/calculator/factorial-calculator/"
        />{' '}
        <h1 className="text-primary">Factorial calculator</h1>
        <span>
          This calculator will help you to calculate the factorial of a number
          with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Prime Factorisation Calculator"
            url="/calculator/prime-factorization-calculator/"
          />
          <Button
            name="Factors of a Number Calculator"
            url="/calculator/factor-calculator/"
          />
        </span>
        <hr />
        <Factorial />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}

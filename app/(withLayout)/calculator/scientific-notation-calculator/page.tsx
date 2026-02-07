import ScientificNotation from '@/components/calculators/ScientificNotation';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Scientific Notation Calculator | doubtlet.com',
  description:
    'This calculator will help you to convert the given number into Sacientific Notation with the steps shown',
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
          breadcrumbText4="Algebra"
          breadcrumbUrl4="/calculator/algebra/"
          breadcrumbText5="Scientific Notation"
          breadcrumbUrl5="/calculator/scientific-notation-calculator/"
        />
        <h1 className="text-primary">Scientific Notation calculator</h1>
        <span>
          This calculator will help you to convert given number into scientific
          notation with the steps shown.
        </span>
        <hr />
        <ScientificNotation />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}

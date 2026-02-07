import UnitVector from '@/components/calculators/UnitVector';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Unit vector Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Unit Vector of the given vector by Step by Step method with the shown steps',
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
          breadcrumbText5="Vectors"
          breadcrumbUrl5="/calculator/vector-operations/"
          breadcrumbText6="Unit Vector"
          breadcrumbUrl6="/calculator/unit-vector-calculator/"
        />
        <h1 className="text-primary">Unit vector Calculator</h1>
        <span>
          This calculator will help you to find the Unit Vector of the given
          vector with the steps shown.
        </span>
        <hr />
        <UnitVector />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}

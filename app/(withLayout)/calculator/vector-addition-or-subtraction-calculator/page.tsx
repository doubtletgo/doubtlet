import VectorAdditionOrSubtraction from '@/components/calculators/VectorAdditionOrSubtraction';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Vector addition or subtraction Calculator | Doubtlet.com',
  description:
    'This calculator will help you to add or subtract two time with a by Step by Step method at a time with the steps shown ',
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
          breadcrumbText6="Add and Subtract"
          breadcrumbUrl6="/calculator/vector-addition-or-subtraction-calculator/"
        />
        <h1 className="text-primary">
          Vector addition or subtraction Calculator
        </h1>
        <span>
          This calculator will help you to add or subtract two Vectors A (x
          <sub>
            <i>1</i>
          </sub>
          i + y<sub>1</sub>j + z<sub>1</sub>k) & B (x
          <sub>2</sub>i + y<sub>2</sub>j + z<sub>2</sub>k) at a time with the
          steps shown.
        </span>
        <hr />
        <VectorAdditionOrSubtraction />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}

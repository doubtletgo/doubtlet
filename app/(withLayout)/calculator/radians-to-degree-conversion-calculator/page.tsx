import ConvertRadianToDegree from '@/components/calculators/ConvertRadianToDegree';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Radian to Degree Calculator | Doubtlet.com',
  description:
    'This calculator will help you to convert the angle in radians to degrees with the steps shown',
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
          breadcrumbText4="Radian to Degree"
          breadcrumbUrl4="/calculator/radians-to-degree-conversion-calculator/"
        />
        <h1 className="text-primary">Radian to Degree Calculator</h1>
        <span>
          This calculator will help you to convert the angle in radians to
          degrees with the steps shown.
          <br />
          Related Calculator:
          <Button
            name="Degree to Radian calculator"
            url="/calculator/degrees-to-radians-conversion-calculator/"
          />
        </span>
        <hr />
        <ConvertRadianToDegree />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}

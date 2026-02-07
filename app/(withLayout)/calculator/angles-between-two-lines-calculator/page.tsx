import AnglesBetweenTwoLinesIn3D from '@/components/calculators/AnglesBetweenTwoLinesIn3D';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Angle between two Lines in 3D Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Angle between two lines in 3D with the Steps shown',
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
          breadcrumbText4="Calculus"
          breadcrumbUrl4="/calculator/calculus/"
          breadcrumbText5="3D"
          breadcrumbUrl5="/calculator/three-dimension-3d/"
          breadcrumbText6="Angle between two lines in 3d"
          breadcrumbUrl6="/calculator/angles-between-two-lines-calculator/"
        />
        <h1 className="text-primary">
          Angle between two Lines in 3D Calculator
        </h1>
        <span>
          This calculator will help you to find the Angle between two lines in
          3-D with the steps shown.
          <br /> Related Calculators:
          <Button
            name="Angle between two Lines in 2D Calculator"
            url="/calculator/angle-between-two-lines-calculator/"
          />
        </span>
        <hr />
        <AnglesBetweenTwoLinesIn3D />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}

import AngleFormedByVectorWithCoordinateAxes from '@/components/calculators/AngleFormedByVectorWithCoordinateAxes';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    'Angle formed by the vector with coordinate axes Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the angle formed by the Vector A = ai+bj+ck with the x, y, and z coordinate axes with the steps shown.',
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
          breadcrumbText6="Angle with Axes"
          breadcrumbUrl6="/calculator/angle-formed-by-vector-with-coordinate-axes/"
        />

        <h1 className="text-primary">
          Angle formed by the vector with coordinate axes Calculator
        </h1>
        <span>
          This calculator will help you to find the angle formed by the Vector A
          = ai+bj+ck with the x, y, and z coordinate axes with the steps shown.
          <br /> Related Calculators:
          <Button
            name="Angle between two Vectors Calculator"
            url="/calculator/angle-between-vectors-calculator/"
          />
        </span>
        <hr />
        <AngleFormedByVectorWithCoordinateAxes />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}

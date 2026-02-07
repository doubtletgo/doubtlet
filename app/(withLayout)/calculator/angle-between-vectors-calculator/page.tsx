import AngleBetweenTwoVectors from '@/components/calculators/AngleBetweenTwoVectors';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Angle between two Vectors Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the acute angle between two given Vectors U = ai+bj+ck & V = pi+ qj + rk Step by Step method with the steps shown.',
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
          breadcrumbText6="Angle"
          breadcrumbUrl6="/calculator/angle-between-vectors-calculator/"
        />
        <h1 className="text-primary">Angle between two Vectors Calculator</h1>
        <span>
          This calculator will help you to find the acute angle between two
          given Vectors U = ai+bj+ck & V = pi+ qj + rk with the steps shown.
          <br /> Related Calculators:
          <Button
            name="Dot product Calculator"
            url="/calculator/dot-product-calculator/"
          />
        </span>
        <hr />
        <AngleBetweenTwoVectors />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}

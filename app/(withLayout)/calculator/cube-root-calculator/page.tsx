import CubeRoot from '@/components/calculators/CubeRoot';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Cube Root Calculator - Fast & Accurate Online Tool | Doubtlet.com',
  description:
    'Find the cube root of any number instantly with our free online cube root calculator. Perfect for math problems, quick calculations, and learning concepts.',
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
          breadcrumbText5="Cube Root"
          breadcrumbUrl5="/calculator/cube-root-calculator/"
        />

        <h1 className="text-primary">{`Cube Root Calculator`}</h1>
        <span>
          {`This calculator will help you to find the cube root of a given number with the steps shown.`}
          <br />
          Related Calculators:
          <Button
            name="Square root to its lowest form calculator"
            url="/calculator/square-root-calculator/"
          />
          <Button
            name="Square Root with steps calculator"
            url="/calculator/square-calculator/"
          />
        </span>
        <hr />

        <CubeRoot />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}

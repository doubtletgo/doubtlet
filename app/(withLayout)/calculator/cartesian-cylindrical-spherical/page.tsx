import Cartesian from '@/components/calculators/Cartesian';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: `Coordinates Conversion Calculators | Doubtlet.com`,
  description: `Explore a comprehensive collection of Coordinates Conversion calculators, including 
      Polar to Cartesian, Cartesian to Polar, Cartesian to Cylindrical, Cartesian to Spherical, 
      Cylindrical to Cartesian, Cylindrical to Spherical, Spherical to Cartesian, and Spherical to 
      Cylindrical. Enhance your mathematical understanding and solve complex problems effortlessly. 
      Your one-stop destination for step-by-step solutions.`,
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
          breadcrumbText5="Coordinates Conversion"
          breadcrumbUrl5="/calculator/cartesian-cylindrical-spherical/"
        />
        <Cartesian />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}

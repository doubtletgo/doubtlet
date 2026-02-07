import LinearAlgebra from '@/components/calculators/LinearAlgebra';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

import ShapesBackground from '@/components/ShapesBackground';

export const metadata = {
  title:
    'Linear Algebra Calculators | Operation on Matrices and Vectors | Doubtlet.com',
  description:
    'Explore a comprehensive collection of Linear algebra calculators including operation on Matrices and Vectors. Enhance your mathematical understanding and solve complex problems effortlessly. Your one-stop destination for step-by-step solution.',
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
        />
        <LinearAlgebra />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
      <ShapesBackground />
    </>
  );
}

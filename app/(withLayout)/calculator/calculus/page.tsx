import Calculus from '@/components/calculators/Calculus';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import ShapesBackground from '@/components/ShapesBackground';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Calculus Calculators| Doubtlet.com',
  description:
    'Explore a comprehensive collection of calculus calculators including function, limits, derivatives, integral, series and numerical analysis. Enhance your mathematical understanding and solve complex problems effortlessly. Your one-stop destination for step-by-step solution.',
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
        />
        <Calculus />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
      <ShapesBackground />
    </>
  );
}

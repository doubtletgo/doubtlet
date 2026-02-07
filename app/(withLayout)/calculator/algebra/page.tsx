import Algebra from '@/components/calculators/Algebra';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import ShapesBackground from '@/components/ShapesBackground';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    'Algebra Calculators: Quadratic equation, Binomial expansion, Solving algebraic equations, Sequence and series, Permutation and Combination | Doubtlet',
  description:
    'Explore a comprehensive collection of algebra calculators including Quadratic equation, Binomial expansion, Solving algebraic equations, Sequence and series, Permutation and Combination. Enhance your mathematical understanding and solve complex problems effortlessly. Your one-stop destination for step-by-step solution.',
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
        />

        <Algebra />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
      <ShapesBackground />
    </>
  );
}

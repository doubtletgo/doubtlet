import LaplaceTransform from '@/components/calculators/LaplaceTransform';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    'Laplace Transform Calculator – Get Laplace Transform Easily | Doubtlet.com',
  description:
    'Use our free Laplace Transform calculator to obtain Laplace transform of any functions easily. Get step-by-step results for your mathematical problems with this powerful online tool.',
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
          breadcrumbText5="Laplace Transform"
          breadcrumbUrl5="/calculator/laplace-transform-calculator/"
        />
        <h1 className="text-primary">Laplace Transform Calculator</h1>
        <span>
          This calculator will help you to find the lowest common multiple of
          given numbers with steps shown.
          <br />
          Related Calculator:
          <Button
            name="Derivative Calculator"
            url="/calculator/derivative-calculator/"
          />
        </span>
        <hr />
        <LaplaceTransform />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}

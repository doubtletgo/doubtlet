import RootMeanSquare from '@/components/calculators/RootMeanSquare';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Root Mean Square (RMS) Value Calculator | Doubtlet.com',
  description:
    'Calculate the Root Mean Square (RMS) value effortlessly with our online RMS calculator. Perfect for electrical, mathematical, and engineering calculations. Try it now!',
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
          breadcrumbUrl4="/calculator/probability-and-statistics/"
          breadcrumbText4="Probability & Statistics"
          breadcrumbUrl5="/calculator/root-mean-square-calculator/"
          breadcrumbText5="Root Mean Square"
        />
        <h1 className="text-primary">
          Root Mean Square (RMS) Value Calculator
        </h1>
        <span>
          This calculator will help you to obtain the Root mean square value for
          the given values with steps shown.
          <br />
          Related Calculator:
          <Button
            name="Geometric Mean Calculator"
            url="/calculator/geometric-mean-calculator/"
          />
        </span>
        <hr />
        <RootMeanSquare />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}

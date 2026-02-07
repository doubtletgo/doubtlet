import TraceOfAMatrix from '@/components/calculators/TraceOfAMatrix';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Matrix Trace Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the trace of a matrix at a time with the steps shown.',
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
          breadcrumbText5="Matrices"
          breadcrumbUrl5="/calculator/matrix-operations/"
          breadcrumbText6="Trace"
          breadcrumbUrl6="/calculator/trace-of-a-matrix/"
        />
        <h1 className="text-primary"> Matrix Trace Calculator</h1>
        <span>
          This calculator will help you to find the trace of a matrix at a time
          with the steps shown.
          <br />
          Related Calculator:
          <Button
            name="Matrix Inverse Calculator"
            url="/calculator/inverse-of-a-matrix/"
          />
        </span>
        <hr />
        <TraceOfAMatrix />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}

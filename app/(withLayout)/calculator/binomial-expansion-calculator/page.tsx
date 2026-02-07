import BinomialExpansion from '@/components/calculators/BinomialExpansion';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Binomial Expansion Calculator | Doubtlet.com',
  description:
    'This calculator will help you to expand the binomial expression with the steps shown.',
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
          breadcrumbText5="Binomial Expansion"
          breadcrumbUrl5="/calculator/binomial-expansion-calculator/"
        />
        <h1 className="text-primary">Binomial Expansion Calculator</h1>
        <span>
          This calculator will help you to expand the binomial expression with
          the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Factorial calculator"
            url="/calculator/factorial-calculator/"
          />
          <Button name="ncr calculator" url="/calculator/ncr/" />
        </span>
        <hr />
        <BinomialExpansion />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}

import PreCalculus from '@/components/calculators/PreCalculus';
import ShapesBackground from '@/components/ShapesBackground';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: `Pre Calculus Calculators | Doubtlet.com`,
  description:
    'Explore a comprehensive collection of pre-calculus calculators including trigonometry, Coordinates conversion, operations on Polyomials, Complex numbers and Coordinate geometry. Enhance your mathematical understanding and solve complex problems effortlessly. Your one-stop destination for step-by-step solution. ',
};

export default async function Page() {
  const headerList = headers();
  const pathname = headerList.get('x-current-path');
  const name = pathname.split('/')?.[2];

  const respNotes = await getNotesServerSide(name);

  return (
    <>
      <div className="container calculator-content text-center mb-5">
        <PreCalculus />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
      <ShapesBackground />
    </>
  );
}

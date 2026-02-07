import ThreeDList from '@/components/calculators/ThreeDList';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

import ShapesBackground from '@/components/ShapesBackground';

export const metadata = {
  title: '"Line and Plane in 3-D Calculators | Doubtlet.com',
  description: `This calculator page will help you to deal with operations of lines and
        planes in 3-d like distance, equation, point of intersection, line of
        intersection, angle etc. with the steps shown.`,
};

export default async function Page() {
  const headerList = headers();
  const pathname = headerList.get('x-current-path');
  const name = pathname.split('/')?.[2];

  const respNotes = await getNotesServerSide(name);

  return (
    <>
      <div className="container calculator-content text-center mb-5">
        <ThreeDList />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
      <ShapesBackground />
    </>
  );
}

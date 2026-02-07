import Vector from '@/components/calculators/Vector';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

import ShapesBackground from '@/components/ShapesBackground';

export const metadata = {
  title: 'Operation on Vector Calculators | Doubtlet.com',
  description: `This calculator page will help you to perform various vector operations like addition, 
        subtraction, scalar multiplication, dot product, cross product, magnitude, unit, projection with 
        the steps shown. It can also find the angle, scalar/vector triple product, angle with coordinate axes, 
        the volume of a parallelopiped, etc. of a vector.`,
};

export default async function Page() {
  const headerList = headers();
  const pathname = headerList.get('x-current-path');
  const name = pathname.split('/')?.[2];

  const respNotes = await getNotesServerSide(name);

  return (
    <>
      <div className="container calculator-content text-center mb-5">
        <Vector />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
      <ShapesBackground />
    </>
  );
}

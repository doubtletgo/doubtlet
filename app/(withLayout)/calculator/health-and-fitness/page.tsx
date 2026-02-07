import HealthAndFitness from '@/components/calculators/Health-and-fitness';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import ShapesBackground from '@/components/ShapesBackground';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Health & Fitness Calculators | Doubtlet',
  description:
    'Explore our Health & Fitness Calculators to calculate BMI, calories burned, target heart rate, and more. Achieve your health and fitness goals with step-by-step guidance tailored to your needs.',
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
          breadcrumbText3="Health & Fitness"
          breadcrumbUrl3="/calculator/health-and-fitness/"
        />
        <HealthAndFitness />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
      <ShapesBackground />
    </>
  );
}

import Math from '@/components/calculators/Math';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import ShapesBackground from '@/components/ShapesBackground';

export const metadata = {
  title: 'Maths Calculator',
  description:
    'This calculator will help you to evaluate the average rate of change of the given function on the given interval, with the steps shown.',
};

export default async function Page() {
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
        />
        <Math />
      </div>
      <ShapesBackground />
    </>
  );
}

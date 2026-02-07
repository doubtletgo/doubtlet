import SynopCalculator from '@/components/calculators/SynopCalculator';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

import Button from '@/components/common/button';

export const metadata = {
    title: 'Synop Calculator for IMD | Doubtlet.com',
    description:
        'Generate Synop messages based on India meteorological department standards.',
};

export default async function Page() {
    const headerList = headers();
    const pathname = headerList.get('x-current-path');
    const name = pathname?.split('/')?.[2] || 'synop-calculator';

    // You might need to add a note for this calculator in your database or notes file if strictly required
    // defaulting to null/empty if not found
    const respNotes = await getNotesServerSide(name);

    return (
        <>
            <div className="container calculator-content text-center mb-5">
                <BreadCrumbs
                    breadcrumbUrl1="/"
                    breadcrumbText1="Home"
                    breadcrumbUrl2="/subjects/"
                    breadcrumbText2="Subjects"
                    breadcrumbText3="Other"
                    breadcrumbUrl3="/calculator/other/"
                    breadcrumbUrl4="/calculator/synop-calculator/"
                    breadcrumbText4="Synop Calculator"
                />
                <h1 className="text-primary">Synop Calculator</h1>
                <span>
                    Generate Synop Code by selecting parameters as per IMD standards.
                    <br />
                    <Button name="Dew Point Calculator" url="/calculator/dew-point-calculator/" />
                    <Button name="Bar correction" url="/calculator/barcorrection/" />
                    <Button
                        name="Average Wind Speed"
                        url="/calculator/average-wind-speed-calculator/"
                    />
                </span>
                <hr />

                <SynopCalculator />
            </div>
            <CalculatorNotes notes={respNotes} calculatorName={name} />
        </>
    );
}

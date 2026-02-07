const fs = require('fs');
const path = require('path');

const logFunc = (msg) => {
    fs.appendFileSync('check_unicode.log', msg + '\n');
};

try {
    const filePath = path.resolve('d:\\imd\\math-app-v2-main\\components\\calculators\\SynopCalculator.tsx');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n');

    // Lines 795 to 805
    for (let i = 794; i <= 804; i++) {
        const line = lines[i];
        for (let j = 0; j < line.length; j++) {
            const code = line.charCodeAt(j);
            if (code > 126) {
                logFunc(`Line ${i + 1} has non-ASCII char code ${code} at pos ${j}: ${JSON.stringify(line[j])}`);
            }
        }
    }
    logFunc('Done checking unicode.');

} catch (err) {
    logFunc(`Error: ${err.message}`);
}

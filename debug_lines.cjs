const fs = require('fs');
const path = require('path');

const logFunc = (msg) => {
    fs.appendFileSync('debug_lines.log', msg + '\n');
};

try {
    const filePath = path.resolve('d:\\imd\\math-app-v2-main\\components\\calculators\\SynopCalculator.tsx');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n');

    // Lines 795 to 805 (0-indexed: 794 to 804)
    for (let i = 794; i <= 804; i++) {
        const line = lines[i];
        if (typeof line === 'string') {
            logFunc(`Line ${i + 1}: "${line}"`);
            logFunc(`Hex: ${Buffer.from(line).toString('hex')}`);
        }
    }

} catch (err) {
    logFunc(`Error: ${err.message}`);
}

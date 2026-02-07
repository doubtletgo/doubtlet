const fs = require('fs');
const path = require('path');

const logFunc = (msg) => {
    fs.appendFileSync('fix_css.log', msg + '\n');
};

try {
    const filePath = path.resolve('d:\\imd\\math-app-v2-main\\components\\calculators\\SynopCalculator.module.css');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n');

    logFunc(`Total lines: ${lines.length}`);

    // Filter out lines containing null bytes
    const cleanLines = lines.filter(line => !line.includes('\u0000'));

    const numRemoved = lines.length - cleanLines.length;
    logFunc(`Removed ${numRemoved} lines containing null bytes.`);

    if (numRemoved > 0) {
        fs.writeFileSync(filePath, cleanLines.join('\n'));
        logFunc('File updated successfully.');
    } else {
        logFunc('No null bytes found. Checking for other corruption?');
    }

} catch (err) {
    logFunc(`Error: ${err.message}\n${err.stack}`);
}

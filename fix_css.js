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

    const startIndices = [];
    lines.forEach((line, index) => {
        // Broaden search to just " . w e a t h e r"
        if (line.includes(' . w e a t h e r') || line.includes('. w  a t h e r') || line.indexOf(' w e a t h e r') > -1) {
            // Check if it looks like the bad one (mostly spaced out)
            if (line.match(/w\s+e\s+a\s+t\s+h\s+e\s+r/)) {
                startIndices.push(index);
            }
        }
    });

    logFunc(`Found potential start lines at indices: ${JSON.stringify(startIndices)}`);

    if (startIndices.length === 0) {
        logFunc('Could not find the start of the bad block. Dumping lines 600-615 for inspection:');
        for (let i = 600; i < 615 && i < lines.length; i++) {
            logFunc(`${i + 1}: ${JSON.stringify(lines[i])}`);
        }
        process.exit(1);
    }

    const firstBadLineIndex = startIndices[0];

    // Find the end of the bad block. 
    let goodBlockIndex = -1;
    for (let i = firstBadLineIndex + 1; i < lines.length; i++) {
        if (lines[i].trim().startsWith('.weatherTimingStats')) {
            goodBlockIndex = i;
            break;
        }
    }

    logFunc(`Found good block start at index: ${goodBlockIndex}`);

    if (goodBlockIndex === -1) {
        logFunc('Could not find the start of the good block.');
        process.exit(1);
    }

    const numToRemove = goodBlockIndex - firstBadLineIndex;
    logFunc(`Removing ${numToRemove} lines from index ${firstBadLineIndex} to ${goodBlockIndex - 1}`);

    lines.splice(firstBadLineIndex, numToRemove);

    const newContent = lines.join('\n');
    fs.writeFileSync(filePath, newContent);
    logFunc('File updated successfully.');

} catch (err) {
    logFunc(`Error: ${err.message}\n${err.stack}`);
    process.exit(1);
}

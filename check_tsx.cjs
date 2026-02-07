const fs = require('fs');
const path = require('path');

const logFunc = (msg) => {
    fs.appendFileSync('check_tsx.log', msg + '\n');
};

try {
    const filePath = path.resolve('d:\\imd\\math-app-v2-main\\components\\calculators\\SynopCalculator.tsx');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n');

    logFunc(`Total lines: ${lines.length}`);

    // Check for null bytes or weird invisible chars around line 801
    const startLine = 790;
    const endLine = 810;

    for (let i = startLine; i < endLine && i < lines.length; i++) {
        const line = lines[i];
        let hasWeird = false;
        let weirdChars = [];

        for (let j = 0; j < line.length; j++) {
            const code = line.charCodeAt(j);
            // Allow tab (9), newline (10), cr (13), proper printables (32-126)
            if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
                hasWeird = true;
                weirdChars.push(code);
            }
        }

        if (hasWeird) {
            logFunc(`Line ${i + 1} has weird chars: ${JSON.stringify(weirdChars)}`);
            logFunc(`Content: ${JSON.stringify(line)}`);
        }
    }

    // Also check strictly if there are any null bytes anywhere
    if (fileContent.includes('\u0000')) {
        logFunc('File contains null bytes!');
    } else {
        logFunc('No null bytes found in the whole file.');
    }

} catch (err) {
    logFunc(`Error: ${err.message}\n${err.stack}`);
}

import PublicGoogleSheetsParser from 'public-google-sheets-parser';
import fs from 'fs';
import path from 'path';

const spreadsheetId = '1ajYqgZ7uAAYAfjJBek_MbGebx0grY7bfbKOty5Y3LG0';

export async function fetchAndSaveFormulaContent(formulaName) {
  const map = await setMap(spreadsheetId);
  const gid = map.get(formulaName);

  if (!gid) {
    throw new Error(`Formula "${formulaName}" does not exist.`);
  }

  const data = await getSheet(spreadsheetId, gid);
  const formulaData = data[0].data;

  // Define the output path for the file
  const outputDir = path.join(process.cwd(), 'public/formulas');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filePath = path.join(outputDir, `${formulaName}.md`);
  fs.writeFileSync(filePath, formulaData, 'utf8');
  console.log(`Saved formula "${formulaName}" to ${filePath}`);
}

// Helper functions (same as before)
async function setMap(id) {
  const files = await getSheet(id);
  const nameWithGID = new Map();
  files.forEach((item) => nameWithGID.set(item.formulaname, item.gid));
  return nameWithGID;
}

async function getSheet(id, gid) {
  const parser = new PublicGoogleSheetsParser(id, { sheetId: gid });
  return parser.parse();
}

// Fetch and save all formulas for the build in batches
export async function fetchAndSaveAllFormulas(batchSize = 5) {
  const map = await setMap(spreadsheetId);
  const formulaNames = Array.from(map.keys());

  for (let i = 0; i < formulaNames.length; i += batchSize) {
    const batch = formulaNames.slice(i, i + batchSize);
    const promises = batch.map((formulaName) =>
      fetchAndSaveFormulaContent(formulaName)
    );

    // Wait for all promises in this batch to resolve
    await Promise.allSettled(promises).then((results) => {
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(
            `Failed to process "${batch[index]}": ${result.reason.message}`
          );
        }
      });
    });
  }
}

import PublicGoogleSheetsParser from 'public-google-sheets-parser';
import fs from 'fs';
import path from 'path';

const spreadsheetId = '1E8Ews8SPxVLJ-UDtem0PES-cGXsnao3lZXQj9R1ps8Q';

export async function fetchAndSaveNotesContent(notes, map) {
  try {
    if (!map) {
      map = await setMap(spreadsheetId);
    }
    const gid = map.get(notes);

    if (!gid) {
      throw new Error(`Notes "${notes}" does not exist.`);
    }

    // Fetch formula data
    const data = await getSheet(spreadsheetId, gid);
    const formulaData = data[0].data;

    // Define the output path for the file
    const outputDir = path.join(process.cwd(), 'public/notes');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const filePath = path.join(outputDir, `${notes}.md`);
    fs.writeFileSync(filePath, formulaData, 'utf8');
    console.log(`Saved notes "${notes}" to ${filePath}`);
  } catch (error) {
    console.error(`Error fetching or saving "${notes}":`, error);
  }
}

async function setMap(id) {
  const files = await getSheet(id);
  const nameWithGID = new Map();
  files.forEach((item) => {
    nameWithGID.set(item.name, item.gid);
  });
  return nameWithGID;
}

async function getSheet(id, gid) {
  const parser = new PublicGoogleSheetsParser(id, { sheetId: gid });
  return parser.parse();
}

// Fetch and save all formulas for the build
export async function fetchAndSaveAllNotes(batchSize = 5) {
  const map = await setMap(spreadsheetId);
  const notesArray = Array.from(map.keys());

  for (let i = 0; i < notesArray.length; i += batchSize) {
    // Create a batch of promises
    const batch = notesArray.slice(i, i + batchSize).map((notes) => {
      return fetchAndSaveNotesContent(notes, map);
    });

    // Use Promise.allSettled to handle all promises in the batch
    const results = await Promise.allSettled(batch);
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(
          `Failed to process "${notesArray[i + index]}": ${result.reason}`
        );
      }
    });

    // Optionally add a delay between batches if necessary
    await new Promise((resolve) => setTimeout(resolve, 100)); // Delay for 1 second
  }
}

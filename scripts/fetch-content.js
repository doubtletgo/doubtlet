import { fetchAndSaveAllFormulas } from '../lib/formula-parser.js';
import { fetchAndSaveAllNotes } from '../lib/notes-parser.js';

async function run() {
  try {
    await fetchAndSaveAllFormulas();
    await fetchAndSaveAllNotes();
    console.log('Successfully fetched and saved all formula files.');
  } catch (error) {
    console.error('Error fetching formula files:', error);
    process.exit(1);
  }
}

run();

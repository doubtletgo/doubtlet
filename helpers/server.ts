import CryptoJS from 'crypto-js';
import config from '@/app-config.json';
const encKey = config.encKey;

export const getNotesServerSide = async (name: string) => {
  try {
    if (!name) throw 'Name is required';
    const isInDevMode = process.env.NODE_ENV === 'development';
    const host = isInDevMode ? 'localhost:3000' : 'www.doubtlet.com';
    const scheme = isInDevMode ? 'http://' : 'https://';
    const path = `${scheme}${host}/notes/${name}.md`;

    const resp = await fetch(path);
    const encryptedNotes = await resp.text();
    if (!encryptedNotes) throw 'Error data';
    const respNotes = CryptoJS.AES.decrypt(encryptedNotes, encKey).toString(
      CryptoJS.enc.Utf8
    );
    return respNotes;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const getFormulaServerSide = async (name: string) => {
  try {
    if (!name) throw 'Name is required';
    const isInDevMode = process.env.NODE_ENV === 'development';
    const host = isInDevMode ? 'localhost:3000' : 'www.doubtlet.com';
    const scheme = isInDevMode ? 'http://' : 'https://';
    const path = `${scheme}${host}/formulas/${name}.md`;

    const resp = await fetch(path);
    const encryptedNotes = await resp.text();
    if (!encryptedNotes) throw 'Error data';
    const respNotes = CryptoJS.AES.decrypt(encryptedNotes, encKey).toString(
      CryptoJS.enc.Utf8
    );
    return respNotes;
  } catch (error) {
    console.log(error);
    return null;
  }
};
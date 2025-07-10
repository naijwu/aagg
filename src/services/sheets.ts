import { google } from "googleapis";
import { CONFIG } from "../config";
import path from 'node:path';

export interface CellUpdate {
  majorDimension: "ROWS",
  range: string; // e.g., "Sheet1!A1", "Sheet1!B2:C2"
  values: (number | string)[][]; // [[ "T-L", "T-R" ], [ "B-L", "B-R" ]] for ROWS majorDimension, flipped otherwise
}

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../../credentials.json'),
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets'
  ],
});

export async function updateSheetCells(updates: CellUpdate[]): Promise<void> {
  const sheets = google.sheets({ version: 'v4', auth });

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: CONFIG.SHEET_ID,
    requestBody: {
      valueInputOption: 'USER_ENTERED',
      data: updates,
    },
  });

  console.log('Spreadsheet updated successfully.');
}

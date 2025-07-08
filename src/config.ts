import fs from 'node:fs';
import path from 'node:path';

export const CONFIG = {
  PLAID_API_URL: process.env.PLAID_URL,
  PLAID_CLIENT_ID: process.env.PLAID_CLIENT_ID,
  PLAID_SECRET: process.env.PLAID_SECRET_PROD,
  PLAID_TD_TOKEN: process.env.PLAID_TD_TOKEN,
  PLAID_AMEX_TOKEN: process.env.PLAID_AMEX_TOKEN,
  PLAID_RBC_TOKEN: process.env.PLAID_RBC_TOKEN,
  PLAID_IBKR_TOKEN: process.env.PLAID_IBKR_TOKEN,
  SHEET_ID: process.env.SHEET_ID,
  SHEET_NAME: process.env.SHEET_NAME,
  CBSA_URL: "https://bcd-api-dca-ipa.cbsa-asfc.cloud-nuage.canada.ca/exchange-rate-lambda/exchange-rates",
}

export type AccountCellMap = {
  plaid_account_id: string; // the ID of the Plaid item's account
  class: "A" | "L"; // A: asset, L: liability (adds a '-' to `balance` value if a liability)
  target: string; // where the updated balance will go
  update: string; // where the "last updated" will go
}

const accountsPath = path.join(__dirname, '../accounts.json');
const accountsData = JSON.parse(fs.readFileSync(accountsPath, 'utf8'));

/**
 *  You'd have to already do the link (_setup/index.html) -> 
 *    public token -> access token exchange and hit the 
 *    balances endpoint manually (via Postman) to get the plaid IDs
 *    of the accounts you want to track, not to mention set up 
 *    the google sheets that has your data.
 * 
 *  Kept in a separate, non-json file so I could 
 */
export const ACCOUNT_MAPS: AccountCellMap[] = accountsData;

// Just for readable names
export const ITEMS_MAP = {
  "TD": CONFIG.PLAID_TD_TOKEN,
  "RBC": CONFIG.PLAID_RBC_TOKEN,
  // etc.
}
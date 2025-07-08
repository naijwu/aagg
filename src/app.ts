import cron from 'node-cron';
import { ACCOUNT_MAPS, CONFIG, ITEMS_MAP } from './config';
import { type Account, getAccountBalances } from './services/plaid';
import { type CellUpdate, updateSheetCells } from './services/sheets';
import { getDepression } from './services/usdcad';

let USD_TO_CAD = 1;

// runs 4pm on M, W, F
console.log("I think we're up")
cron.schedule('0 16 * * 1,3,5', async () => {
  try {
    console.log('Running updater...');
    USD_TO_CAD = await getDepression();
    await update();
    console.log('Update complete.');
  } catch (err) {
    console.error('Update failed:', err);
  }
});

const update = async () => {
  // updating by item because 1) plaid is more finnicky than sheets and 2) to keep it simple
  for (const [name, access_token] of Object.entries(ITEMS_MAP)) {
    try {
      if (!access_token) throw new Error("No access token for given item/institution");
      const balance = await getAccountBalances(access_token);

      const accounts = balance.accounts;
      if (!accounts || accounts?.length == 0) throw new Error("No accounts were found");
      const updateValues = parseAccountsToCells(accounts);

      await updateSheetCells(updateValues);
    } catch (error) {
      // failing silently -- it's okay... 
      console.error("Failed to update balances for: ", name, error);
      // ...it's just about getting back up
      console.log("I can't get up...")
      // nevermind
    }
  }
}

/**
 * 
 * @param accounts - the accounts (chequing, investment, etc.) of the Plaid item (bank)
 * @returns an array of cell update data ready for the sheets api
 */
const parseAccountsToCells = (accounts: Account[]): CellUpdate[] => {
  const cellUpdates: CellUpdate[] = [];

  for (const accountDetail of ACCOUNT_MAPS) {
    const account = accounts?.find((a) => a.account_id === accountDetail.plaid_account_id) ?? null
    if (!account) continue;

    const newBalance = account.balances.current * (accountDetail.class === "L" ? -1 : 1) * (account.balances.iso_currency_code === "CAD" ? 1 : USD_TO_CAD)
    const lastUpdated = new Date().toISOString();

    cellUpdates.push({
      majorDimension: "ROWS",
      range: `${CONFIG.SHEET_NAME}!${accountDetail.target.toUpperCase()}:${accountDetail.update.toUpperCase()}`,
      values: [[newBalance, lastUpdated]]
    })
  }
  return cellUpdates;
}

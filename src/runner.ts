
import cron from 'node-cron';
import { main } from "./app.js"

console.log("I think we're up")
cron.schedule('0 16 * * 1,3,5', async () => {
  await main();
});















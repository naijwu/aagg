import axios from 'axios';
import { CONFIG } from '../config.js';

const PLAID_API_URL = `${CONFIG.PLAID_API_URL}/accounts/balance/get`;
const PLAID_CLIENT_ID = CONFIG.PLAID_CLIENT_ID;
const PLAID_SECRET = CONFIG.PLAID_SECRET;

export interface PlaidBalanceRequest {
  client_id: string;
  secret: string;
  access_token: string;
}

export interface Account {
  account_id: string;
  balances: {
    available: number | null;
    current: number;
    iso_currency_code: "CAD" | "USD" | string;
    limit?: number | null;
    unofficial_currency_code?: string | null;
  };
  name: string;
  official_name?: string;
  subtype: string;
  type: string;
}

export interface PlaidBalanceResponse {
  accounts: Account[];
  item: {
    available_products: string[];
    billed_products: string[];
    consent_expiration_time: string | null;
    error: null | {
      error_code: string;
      error_message: string;
      error_type: string;
    };
    item_id: string;
    update_type: string;
  };
  request_id: string;
}

export async function getAccountBalances(
  credentials?: Partial<PlaidBalanceRequest>
): Promise<PlaidBalanceResponse> {
  const response = await axios.post<PlaidBalanceResponse>(PLAID_API_URL, {
    client_id: PLAID_CLIENT_ID,
    secret: PLAID_SECRET,
    access_token: process.env.PLAID_ENV_URL,
    ...(credentials ?? {})
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
}
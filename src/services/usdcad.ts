import axios from "axios";
import { CONFIG } from "../config";

export interface ExchangeRatesAPIResponse {
  ForeignExchangeRates: {
    ExchangeRateId: number;
    Rate: string;
    ExchangeRateEffectiveTimestamp: string; // ISOTimestamp
    ExchangeRateExpiryTimestamp: string; // ISOTimestamp
    ExchangeRateSource: "CBSA" | string;
    FromCurrency: {
      Value: "USD" | string
    };
    FromCurrencyCSN: number;
    ToCurrency: {
      Value: "CAD"
    };
    ToCurrencyCSN: number;
  }[]
}

export async function getDepression(): Promise<number> {
  const response = await axios.get<ExchangeRatesAPIResponse>(CONFIG.CBSA_URL);
  const rates = response.data;

  // could find by ExchangeRateId but idk if that changes
  //  and i have compute to burn
  //      so...
  //                ... ..
  const usdRate = rates.ForeignExchangeRates.find((r) => r.FromCurrency.Value === "USD");
  return Number(usdRate?.Rate ?? 0);
}
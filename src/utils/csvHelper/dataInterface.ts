import { Document } from "mongoose";

export interface IndexData extends Document {
  "Index Name": string;
  "Index Date": string;
  "Open Index Value": string;
  "High Index Value": string;
  "Low Index Value": string;
  "Closing Index Value": string;
  "Points Change": string;
  "Change Percent": string;
  Volume: string;
  Turnover: string;
  "P/E": string;
  "P/B": string;
  "Div Yield": string;
}

export interface StockData {
  SYMBOL: string;
  SERIES: string;
  DATE1: string;
  PREV_CLOSE: string;
  OPEN_PRICE: string;
  HIGH_PRICE: string;
  LOW_PRICE: string;
  LAST_PRICE: string;
  CLOSE_PRICE: string;
  AVG_PRICE: string;
  TTL_TRD_QNTY: string;
  TURNOVER_LACS: string;
  NO_OF_TRADES: string;
  DELIV_QTY: string;
  DELIV_PER: string;
}

export interface OptionData extends Document {
  INSTRUMENT: string;
  SYMBOL: string;
  EXPIRY_DT: string;
  STRIKE_PR: string;
  OPTION_TYP: string;
  OPEN: string;
  HIGH: string;
  LOW: string;
  CLOSE: string;
  SETTLE_PR: string;
  CONTRACTS: string;
  VAL_INLAKH: string;
  OPEN_INT: string;
  CHG_IN_OI: string;
  TIMESTAMP: String;
}

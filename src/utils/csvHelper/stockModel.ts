import mongoose, { Schema } from "mongoose";
import { StockData } from "./dataInterface";

const StockDataSchema: Schema = new Schema({
  SYMBOL: String,
  SERIES: String,
  DATE1: String,
  PREV_CLOSE: String,
  OPEN_PRICE: String,
  HIGH_PRICE: String,
  LOW_PRICE: String,
  LAST_PRICE: String,
  CLOSE_PRICE: String,
  AVG_PRICE: String,
  TTL_TRD_QNTY: String,
  TURNOVER_LACS: String,
  NO_OF_TRADES: String,
  DELIV_QTY: String,
  DELIV_PER: String,
});

export function createStockCollection(CollectionName: string) {
  return mongoose.model<StockData>(
    CollectionName.replace(/\s/g, ""),
    StockDataSchema
  );
}

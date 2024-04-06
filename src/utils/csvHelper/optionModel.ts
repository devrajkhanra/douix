import mongoose, { Schema } from "mongoose";
import { OptionData } from "./dataInterface";

export const OptionDataSchema: Schema = new Schema({
  INSTRUMENT: String,
  SYMBOL: String,
  EXPIRY_DT: String,
  STRIKE_PR: String,
  OPTION_TYP: String,
  OPEN: String,
  HIGH: String,
  LOW: String,
  CLOSE: String,
  SETTLE_PR: String,
  CONTRACTS: String,
  VAL_INLAKH: String,
  OPEN_INT: String,
  CHG_IN_OI: String,
  TIMESTAMP: String,
});

export function createOptionCollection(CollectionName: string) {
  return mongoose.model<OptionData & Document>(
    CollectionName.replace(/\s/g, ""),
    OptionDataSchema
  );
}

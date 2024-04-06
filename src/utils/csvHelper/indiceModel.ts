import mongoose, { Schema } from "mongoose";
import { IndexData } from "./dataInterface";

const IndexDataSchema: Schema = new Schema({
  "Index Name": String, // Match the column name in CSV
  "Index Date": String, // Match the column name in CSV
  "Open Index Value": String, // Match the column name in CSV
  "High Index Value": String, // Match the column name in CSV
  "Low Index Value": String, // Match the column name in CSV
  "Closing Index Value": String, // Match the column name in CSV
  "Points Change": String, // Match the column name in CSV
  "Change Percent": String, // Match the column name in CSV
  Volume: String,
  Turnover: String,
  "P/E": String, // Match the column name in CSV
  "P/B": String, // Match the column name in CSV
  "Div Yield": String, // Match the column name in CSV
});

export function createCollection(IndexName: string) {
  return mongoose.model<IndexData>(
    IndexName.replace(/\s/g, ""),
    IndexDataSchema
  );
}

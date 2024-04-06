// pages/api/parseAndSaveData.ts

import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../api/mongoose";
import {
  processIndiceDataFromCSV,
  processOptionDataFromZip,
  processStockDataFromCSV,
} from "@/utils/csvHelper";

import { formatDate, parseDate, saveLastUpdatedDate } from "@/utils/dateHelper";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { optionURL, indiceURL, stockURL, dateStr } = req.body; // Assuming the request body contains the URL of the CSV

    await connectDB(); // Connect to MongoDB before calling parseAndSaveData
    await processIndiceDataFromCSV(indiceURL); // Parse and save data from CSV
    await processStockDataFromCSV(stockURL); // Parse and save data from CSV
    await processOptionDataFromZip(optionURL); // Parse and save data from CSV
    await saveLastUpdatedDate(dateStr);
    return res
      .status(200)
      .json({ message: "Data parsed and saved successfully" });
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

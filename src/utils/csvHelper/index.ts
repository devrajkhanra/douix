import Papa from "papaparse";
import JSZip from "jszip";
import fs from "fs";
import moment from "moment";
import { createCollection } from "./indiceModel";
import { createStockCollection } from "./stockModel";
import { createOptionCollection } from "./optionModel";
import { OptionData } from "./dataInterface";

export const broadNames: string[] = [
  "Nifty 50",
  "Nifty Next 50",
  "Nifty Midcap 50",
  "Nifty Auto",
  "Nifty Bank",
  "Nifty Commodities",
  "Nifty Consumer Durables",
  "Nifty CPSE",
  "Nifty Energy",
  "Nifty Financial Services",
  "Nifty FMCG",
  "Nifty Healthcare Index",
  "Nifty IT",
  "Nifty India Consumption",
  "Nifty India Digital",
  "Nifty Infrastructure",
  "Nifty Media",
  "Nifty Metal",
  "Nifty MNC",
  "Nifty Oil & Gas",
  "Nifty Pharma",
  "Nifty PSU Bank",
  "Nifty PSE",
  "Nifty Private Bank",
  "Nifty Realty",
  "Nifty Services Sector",
];

export async function processIndiceDataFromCSV(csvURL: string): Promise<void> {
  try {
    // Fetch CSV data from the provided URL
    const response = await fetch(csvURL);
    const csvData = await response.text();
    const parsedData = Papa.parse<{ [key: string]: string }>(csvData, {
      header: true,
    }).data;

    for (const item of parsedData) {
      const indexName: string = item["Index Name"];

      // Check if the index name is in the broadNames array
      if (broadNames.includes(indexName)) {
        const CollectionModel = createCollection(indexName);
        const existingData = await CollectionModel.findOne({
          "Index Date": item["Index Date"],
        });

        if (!existingData) {
          const indexData = new CollectionModel({
            "Index Name": indexName,
            "Index Date": item["Index Date"],
            "Open Index Value": parseFloat(item["Open Index Value"]),
            "High Index Value": parseFloat(item["High Index Value"]),
            "Low Index Value": parseFloat(item["Low Index Value"]),
            "Closing Index Value": parseFloat(item["Closing Index Value"]),
            "Points Change": parseFloat(item["Points Change"]),
            "Change Percent": parseFloat(item["Change Percent"]),
            Volume: parseFloat(item["Volume"]),
            Turnover: parseFloat(item["Turnover"]),
            "P/E": item["P/E"] === "-" ? null : parseFloat(item["P/E"]),
            "P/B": item["P/B"] === "-" ? null : parseFloat(item["P/B"]),
            "Div Yield":
              item["Div Yield"] === "-" ? null : parseFloat(item["Div Yield"]),
          });

          await indexData.save();
          console.log(
            `Inserted ${indexName} data with date ${item["Index Date"]} into MongoDB`
          );
        } else {
          console.log(
            `Data for ${indexName} with date ${item["Index Date"]} already exists in MongoDB`
          );
        }
      }
    }
  } catch (error) {
    console.error("Error processing CSV data:", error);
    throw error;
  }
}

export async function processStockDataFromCSV(csvURL: string): Promise<void> {
  try {
    // Fetch CSV data from the provided URL
    const stockNamesResponse = await fetch(
      "https://archives.nseindia.com/content/indices/ind_nifty200list.csv"
    );
    const stockNamesCSV = await stockNamesResponse.text();
    const stockNamesData = Papa.parse<{ [key: string]: string }>(
      stockNamesCSV,
      {
        header: true,
      }
    ).data;

    // Extract stock symbols from the retrieved CSV
    const validSymbols: string[] = stockNamesData.map((item) => item["Symbol"]);

    // Fetch and process the provided CSV data
    const response = await fetch(csvURL);
    const csvData = await response.text();
    const parsedData = Papa.parse<{ [key: string]: string }>(csvData, {
      header: true,
    }).data;

    for (const item of parsedData) {
      // Check if the series is "EQ" and if the symbol is in the validSymbols list
      if (item[" SERIES"] !== " EQ" || !validSymbols.includes(item["SYMBOL"])) {
        continue; // Skip to the next iteration if series is not "EQ" or symbol is not valid
      }

      // Process valid stock data
      const symbol: string = item["SYMBOL"];

      const StockCollectionModel = createStockCollection(symbol);
      const existingData = await StockCollectionModel.findOne({
        DATE1: item[" DATE1"],
      });

      if (!existingData) {
        const stockData = new StockCollectionModel({
          SYMBOL: symbol,
          SERIES: item[" SERIES"],
          DATE1: item[" DATE1"],
          PREV_CLOSE: parseFloat(item[" PREV_CLOSE"]),
          OPEN_PRICE: parseFloat(item[" OPEN_PRICE"]),
          HIGH_PRICE: parseFloat(item[" HIGH_PRICE"]),
          LOW_PRICE: parseFloat(item[" LOW_PRICE"]),
          LAST_PRICE: parseFloat(item[" LAST_PRICE"]),
          CLOSE_PRICE: parseFloat(item[" CLOSE_PRICE"]),
          AVG_PRICE: parseFloat(item[" AVG_PRICE"]),
          TTL_TRD_QNTY: parseFloat(item[" TTL_TRD_QNTY"]),
          TURNOVER_LACS: parseFloat(item[" TURNOVER_LACS"]),
          NO_OF_TRADES: parseFloat(item[" NO_OF_TRADES"]),
          DELIV_QTY: parseFloat(item[" DELIV_QTY"]),
          DELIV_PER: parseFloat(item[" DELIV_PER"]),
        });

        await stockData.save();
        console.log(
          `Inserted ${symbol} data with date ${item[" DATE1"]} into MongoDB`
        );
      } else {
        console.log(
          `Data for ${symbol} with date ${item[" DATE1"]} already exists in MongoDB`
        );
      }
    }
  } catch (error) {
    console.error("Error processing CSV data:", error);
    throw error;
  }
}

export async function processOptionDataFromZip(
  zipFilePath: string
): Promise<void> {
  try {
    // Read the ZIP file from the local file system
    const zipData = fs.readFileSync(zipFilePath);

    const zip = await JSZip.loadAsync(zipData);
    const fileNames = Object.keys(zip.files);

    for (const fileName of fileNames) {
      if (fileName.endsWith(".csv")) {
        const csvFile = zip.files[fileName];
        // Read the CSV file content
        const csvData = await csvFile.async("text");

        const parsedData = Papa.parse<OptionData>(csvData, {
          header: true,
        }).data;

        for (const item of parsedData) {
          // Check if the SYMBOL is either "NIFTY" or "BANKNIFTY"
          if (item.SYMBOL !== "NIFTY" && item.SYMBOL !== "BANKNIFTY") {
            continue; // Skip to the next iteration if SYMBOL is not "NIFTY" or "BANKNIFTY"
          }

          const OptionCollectionModel = createOptionCollection(item.SYMBOL);
          // const existingData = await OptionCollectionModel.findOne({
          //   INSTRUMENT: item.INSTRUMENT,
          //   TIMESTAMP: item.TIMESTAMP,
          //   EXPIRY_DT: item.EXPIRY_DT,
          // });

          // if (!existingData) {
          const optionData = new OptionCollectionModel(item);
          await optionData.save();
          console.log(
            `Inserted ${item.SYMBOL} data with timestamp ${item.TIMESTAMP} and expiry date ${item.EXPIRY_DT} into MongoDB`
          );
          // } else {
          //   console.log(
          //     `Data for ${item.SYMBOL} with timestamp ${item.TIMESTAMP} and expiry date ${item.EXPIRY_DT} already exists in MongoDB`
          //   );
          // }
        }
      }
    }
  } catch (error) {
    console.error("Error processing ZIP data:", error);
    throw error;
  }
}

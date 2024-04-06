import mongoose, { Model } from "mongoose";
import { OptionData } from "../../utils/csvHelper/dataInterface";
import { createOptionCollection } from "../csvHelper/optionModel";

type OptionDataModel = mongoose.Model<OptionData & Document>;
// Function to get expiries in the database
export async function fetchExpiryDates(
  collectionName: string,
  instrument: string
): Promise<string[]> {
  try {
    // Get the model for the specified collection
    const OptionDataCollection: OptionDataModel =
      createOptionCollection(collectionName);

    // Query the collection to find documents with the specified instrument
    const documents: (OptionData & Document)[] =
      await OptionDataCollection.find({ INSTRUMENT: instrument }).exec();

    // Extract expiry dates from the documents
    const expiryDates: string[] = documents.map(
      (doc: OptionData & Document) => doc.EXPIRY_DT
    );

    return expiryDates;
  } catch (error) {
    // Handle errors
    console.error("Error fetching expiry dates:", error);
    return [];
  }
}

export async function getMatchingDocuments(
  selectedDates: string[],
  instrument: string,
  collectionName: string
): Promise<(OptionData & Document)[]> {
  try {
    console.log("Collection name:", collectionName);
    console.log("Insrument:", instrument);
    console.log("selectedDates:", selectedDates);
    // Assuming createOptionCollection dynamically creates the model based on collectionName
    const OptionDataCollection = mongoose.model(collectionName);

    // Construct an array of query conditions for each selected date
    const dateConditions = selectedDates.map((date) => ({ EXPIRY_DT: date }));

    // Query the collection to find documents matching the instrument and containing each selected date in the EXPIRY_DT field
    const documents: (OptionData & Document)[] =
      await OptionDataCollection.find({
        INSTRUMENT: instrument,
        $and: dateConditions,
      }).exec();

    return documents;
  } catch (error) {
    // Handle errors
    console.error("Error fetching matching documents:", error);
    return [];
  }
}

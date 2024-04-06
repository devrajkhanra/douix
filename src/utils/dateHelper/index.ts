import moment from "moment";
import { LastUpdated } from "./dateModel";

export function formatDate(date: Date): string {
  const day: string = String(date.getDate()).padStart(2, "0");
  const month: string = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
  const year: number = date.getFullYear();

  return `${day}${month}${year}`;
}

export function parseDate(date: Date): String {
  return moment(date, "DDMMYYYY").format("DDMMYYYY");
}

// Function to save the last updated date in the database
export async function saveLastUpdatedDate(date: string): Promise<void> {
  try {
    // Check if the collection exists
    const count = await LastUpdated.countDocuments();

    // If the collection doesn't exist, create it and insert the date
    if (count === 0) {
      await LastUpdated.create({ date });
    } else {
      // If the collection exists, update the existing document with the new date
      await LastUpdated.findOneAndUpdate({}, { date });
    }
    console.log("Last updated date saved successfully.");
  } catch (error) {
    console.error("Error saving last updated date:", error);
    throw error;
  }
}

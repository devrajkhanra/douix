import { OptionData } from "@/utils/csvHelper/dataInterface";
import { getMatchingDocuments } from "@/utils/dbHelper";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OptionData[] | { error: string }>
) {
  if (req.method === "POST") {
    const { selectedDates, instrument, collectionName } = req.body;
    console.log("Api:", { selectedDates, instrument, collectionName });
    try {
      const matchingDocuments = await getMatchingDocuments(
        selectedDates,
        instrument,
        collectionName
      );
      res.status(200).json(matchingDocuments);
    } catch (error) {
      console.error("Error fetching matching documents:", error);
      res.status(500).json({ error: "Error fetching matching documents" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

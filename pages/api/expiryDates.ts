import { fetchExpiryDates } from "@/utils/dbHelper";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { collectionName, instrument } = req.query;
    if (!collectionName || !instrument) {
      console.error(
        "Missing parameters: collectionName and instrument are required."
      );
      return res.status(400).json({
        error:
          "Missing parameters: collectionName and instrument are required.",
      });
    }
    try {
      const fetchedDates = await fetchExpiryDates(
        collectionName as string,
        instrument as string
      );
      const expiryDates = Array.from(new Set(fetchedDates));
      console.log(expiryDates);
      return res.status(200).json({ expiryDates });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}

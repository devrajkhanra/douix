// pages/api/lastUpdatedDate.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "./mongoose";
import { LastUpdated } from "@/utils/dateHelper/dateModel";

connectDB(); // Connect to MongoDB

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const lastUpdatedDate = await LastUpdated.findOne();

      if (lastUpdatedDate) {
        return res.status(200).json({ date: lastUpdatedDate.date });
      } else {
        return res.status(404).json({ error: "Last updated date not found" });
      }
    } catch (error) {
      console.error("Error fetching last updated date:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

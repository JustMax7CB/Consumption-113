import { decryptObject } from "../lib/crypto.js";
import { getFile } from "../lib/github.js";

export default async function handler(req, res) {
  console.log("history handler: Request received", req.method);

  if (req.method !== "GET") {
    console.log("history handler: Method not allowed");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("history handler: Calling getFile...");
    const { content } = await getFile();

    console.log("history handler: getFile returned, content length:", content?.length || 0);

    if (!content) {
      console.log("history handler: No content, returning empty array");
      return res.json([]);
    }

    console.log("history handler: Parsing and decrypting rows...");
    const rows = content
      .trim()
      .split("\n")
      .map((line, index) => {
        console.log(`history handler: Processing row ${index + 1}`);
        const entry = JSON.parse(line);
        return {
          ts: entry.ts,
          data: decryptObject(entry.cipher)
        };
      });

    console.log("history handler: Successfully processed", rows.length, "rows");
    res.status(200).json(rows);
  } catch (err) {
    console.error("history handler: Error occurred:", err.message);
    console.error(err.stack);
    res.status(500).json({ error: "History fetch failed" });
  }
}

import { decryptObject } from "../lib/crypto.js";
import { getFile } from "../lib/github.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { content } = await getFile();

    if (!content) return res.json([]);

    const rows = content
      .trim()
      .split("\n")
      .map(line => {
        const entry = JSON.parse(line);
        return {
          ts: entry.ts,
          data: decryptObject(entry.cipher)
        };
      });

    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "History fetch failed" });
  }
}

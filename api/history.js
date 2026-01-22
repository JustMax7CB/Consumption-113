export default async function handler(req, res) {
  console.log("history handler: Request received", req.method);

  let decryptObject, getFile;

  try {
    console.log("history handler: Loading crypto.js...");
    const cryptoModule = await import("../lib/crypto.js");
    decryptObject = cryptoModule.decryptObject;
    console.log("history handler: crypto.js loaded");
  } catch (err) {
    console.error("history handler: Failed to load crypto.js:", err.message, err.stack);
    return res.status(500).json({ error: "Failed to load crypto module", details: err.message });
  }

  try {
    console.log("history handler: Loading github.js...");
    const githubModule = await import("../lib/github.js");
    getFile = githubModule.getFile;
    console.log("history handler: github.js loaded");
  } catch (err) {
    console.error("history handler: Failed to load github.js:", err.message, err.stack);
    return res.status(500).json({ error: "Failed to load github module", details: err.message });
  }

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

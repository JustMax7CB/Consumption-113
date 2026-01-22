import { encryptObject } from "../lib/crypto.js";
import { getFile, saveFile } from "../lib/github.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = await readJson(req);

    const entry = {
      ts: new Date().toISOString(),
      cipher: encryptObject(body)
    };

    const { content, sha } = await getFile();
    const newContent =
      content + JSON.stringify(entry) + "\n";

    await saveFile(newContent, sha);

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Submit failed" });
  }
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", chunk => (data += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(data));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
  });
}

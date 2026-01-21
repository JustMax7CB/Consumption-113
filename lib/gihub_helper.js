const API = "https://api.github.com";

const headers = {
  "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
  "Accept": "application/vnd.github+json"
};

export async function getFile() {
  const url = `${API}/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/${process.env.DATA_FILE}?ref=${process.env.GITHUB_BRANCH}`;

  const res = await fetch(url, { headers });

  if (res.status === 404) {
    return { content: "", sha: null };
  }

  if (!res.ok) throw new Error("Failed to fetch file");

  const json = await res.json();

  return {
    content: Buffer.from(json.content, "base64").toString("utf8"),
    sha: json.sha
  };
}

export async function saveFile(content, sha) {
  const url = `${API}/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/${process.env.DATA_FILE}`;

  const body = {
    message: "append encrypted entry",
    content: Buffer.from(content, "utf8").toString("base64"),
    branch: process.env.GITHUB_BRANCH,
    ...(sha && { sha })
  };

  const res = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(body)
  });

  if (!res.ok) throw new Error("Failed to save file");
}

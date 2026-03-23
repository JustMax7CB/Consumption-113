import crypto from "crypto";

const ALGO = "aes-256-gcm";

let KEY = null;

function getKey() {
  if (KEY) return KEY;

  if (!process.env.ENCRYPTION_KEY) {
    console.error("crypto: ENCRYPTION_KEY environment variable is not set");
    throw new Error("ENCRYPTION_KEY environment variable is not set");
  }

  KEY = Buffer.from(process.env.ENCRYPTION_KEY, "hex");

  if (KEY.length !== 32) {
    console.error("crypto: ENCRYPTION_KEY must be 32 bytes (64 hex chars), got:", KEY.length);
    throw new Error("ENCRYPTION_KEY must be 32 bytes (64 hex chars)");
  }

  console.log("crypto: Key loaded successfully");
  return KEY;
}

export function encryptObject(obj) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, getKey(), iv);

  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(obj), "utf8"),
    cipher.final()
  ]);

  return {
    iv: iv.toString("hex"),
    tag: cipher.getAuthTag().toString("hex"),
    data: encrypted.toString("hex")
  };
}

export function decryptObject(payload) {
  const decipher = crypto.createDecipheriv(
    ALGO,
    getKey(),
    Buffer.from(payload.iv, "hex")
  );

  decipher.setAuthTag(Buffer.from(payload.tag, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payload.data, "hex")),
    decipher.final()
  ]);

  return JSON.parse(decrypted.toString("utf8"));
}

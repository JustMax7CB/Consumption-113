import crypto from "crypto";

const ALGO = "aes-256-gcm";
const KEY = Buffer.from(process.env.ENCRYPTION_KEY, "hex");

if (KEY.length !== 32) {
  throw new Error("ENCRYPTION_KEY must be 32 bytes (64 hex chars)");
}

export function encryptObject(obj) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);

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
    KEY,
    Buffer.from(payload.iv, "hex")
  );

  decipher.setAuthTag(Buffer.from(payload.tag, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payload.data, "hex")),
    decipher.final()
  ]);

  return JSON.parse(decrypted.toString("utf8"));
}

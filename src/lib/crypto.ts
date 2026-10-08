import crypto from "crypto";

if (typeof window !== "undefined") {
  throw new Error("crypto.ts can only be used on the server.");
}

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH_BYTES = 12; // 96-bit IV is standard and recommended for AES-GCM
const AUTH_TAG_LENGTH_BYTES = 16; // 128-bit authentication tag

/**
 * Validates and returns the 32-byte encryption key from the environment.
 * The key must be a 64-character hexadecimal string.
 */
function getEncryptionKey(): Buffer {
  const hexKey = process.env.TOKEN_ENCRYPTION_KEY;
  if (!hexKey) {
    throw new Error("TOKEN_ENCRYPTION_KEY environment variable is not set.");
  }

  if (hexKey.length !== 64 || !/^[0-9a-fA-F]+$/.test(hexKey)) {
    throw new Error(
      "TOKEN_ENCRYPTION_KEY must be a 64-character hexadecimal string representing 32 bytes."
    );
  }

  const keyBuffer = Buffer.from(hexKey, "hex");
  if (keyBuffer.length !== 32) {
    throw new Error("TOKEN_ENCRYPTION_KEY must decode to exactly 32 bytes.");
  }

  return keyBuffer;
}

/**
 * Encrypts a plaintext string (e.g. Google refresh token) using AES-256-GCM.
 * Generates a fresh random 12-byte IV for every encryption.
 * Serializes as hex: `iv:authTag:ciphertext`.
 *
 * Never logs or leaks plaintext, ciphertext, or keys.
 */
export function encryptToken(value: string): string {
  if (!value) {
    throw new Error("Cannot encrypt empty value.");
  }

  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH_BYTES);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${ciphertext.toString("hex")}`;
}

/**
 * Decrypts a serialized `iv:authTag:ciphertext` token using AES-256-GCM.
 * Verifies authenticity via the authentication tag before returning plaintext.
 *
 * Never logs or leaks plaintext, ciphertext, or keys.
 */
export function decryptToken(encrypted: string): string {
  if (!encrypted) {
    throw new Error("Cannot decrypt empty value.");
  }

  const parts = encrypted.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted token format. Expected 'iv:authTag:ciphertext'.");
  }

  const [ivHex, authTagHex, ciphertextHex] = parts;
  if (!ivHex || !authTagHex || !ciphertextHex) {
    throw new Error("Encrypted token contains empty segments.");
  }

  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const ciphertext = Buffer.from(ciphertextHex, "hex");

  if (iv.length !== IV_LENGTH_BYTES) {
    throw new Error("Invalid IV length in encrypted token.");
  }

  if (authTag.length !== AUTH_TAG_LENGTH_BYTES) {
    throw new Error("Invalid authentication tag length in encrypted token.");
  }

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

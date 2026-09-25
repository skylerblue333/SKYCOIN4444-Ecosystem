/**
 * Legacy email/password authentication helpers.
 *
 * Password login is NOT configured for the current SKYCOIN4444 beta. The
 * canonical auth router deliberately fails closed for password login. This file
 * retains reusable cryptographic helpers without fabricating account
 * persistence, password changes, reset delivery, or successful sign-in.
 */

import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";

const JWT_EXPIRY = "7d";
const SCRYPT_N = 16_384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEY_BYTES = 64;
const MIN_JWT_SECRET_CHARS = 32;

export interface SignupInput {
  email: string;
  password: string;
  name: string;
}

export interface SigninInput {
  email: string;
  password: string;
}

export interface AuthToken {
  token: string;
  userId: number;
  email: string;
  name: string;
  expiresIn: string;
}

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret || secret.length < MIN_JWT_SECRET_CHARS) {
    throw new Error(
      "JWT_SECRET must be configured with at least 32 characters"
    );
  }
  return new TextEncoder().encode(secret);
}

function derivePasswordKey(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(
      password,
      salt,
      SCRYPT_KEY_BYTES,
      { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P },
      (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(derivedKey);
      }
    );
  });
}

/**
 * Hash a password with the Node.js scrypt KDF and a unique random salt.
 *
 * Encoded format:
 * scrypt$N$r$p$saltBase64Url$digestBase64Url
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password) throw new Error("Password is required");

  const salt = randomBytes(16);
  const digest = await derivePasswordKey(password, salt);

  return [
    "scrypt",
    String(SCRYPT_N),
    String(SCRYPT_R),
    String(SCRYPT_P),
    salt.toString("base64url"),
    digest.toString("base64url"),
  ].join("$");
}

/**
 * Verify a password using the KDF parameters embedded in the stored hash.
 * Malformed or unsupported hashes fail closed.
 */
export async function verifyPassword(
  password: string,
  encodedHash: string
): Promise<boolean> {
  try {
    const [scheme, nText, rText, pText, saltText, digestText, extra] =
      encodedHash.split("$");

    if (
      scheme !== "scrypt" ||
      extra !== undefined ||
      !saltText ||
      !digestText
    ) {
      return false;
    }

    const N = Number(nText);
    const r = Number(rText);
    const p = Number(pText);
    if (N !== SCRYPT_N || r !== SCRYPT_R || p !== SCRYPT_P) {
      return false;
    }

    const salt = Buffer.from(saltText, "base64url");
    const expected = Buffer.from(digestText, "base64url");
    if (salt.length !== 16 || expected.length !== SCRYPT_KEY_BYTES) {
      return false;
    }

    const actual = await derivePasswordKey(password, salt);
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

/**
 * Create a signed JWT only when an explicit strong runtime secret exists.
 * This helper is not the canonical beta password-login path.
 */
export async function createToken(
  userId: number,
  email: string
): Promise<string> {
  return new SignJWT({ userId, email })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(getJwtSecret());
}

/**
 * Verify a JWT created by this legacy helper.
 */
export async function verifyToken(
  token: string
): Promise<{ userId: number; email: string } | null> {
  try {
    const verified = await jwtVerify(token, getJwtSecret(), {
      algorithms: ["HS256"],
    });
    const userId = verified.payload.userId;
    const email = verified.payload.email;

    if (typeof userId !== "number" || typeof email !== "string") {
      return null;
    }

    return { userId, email };
  } catch {
    return null;
  }
}

/**
 * Password-account persistence is not configured. Do not create a user record
 * or issue a token until a credential store with password-hash persistence is
 * explicitly integrated and tested.
 */
export async function signup(input: SignupInput): Promise<AuthToken | null> {
  void input;
  return null;
}

/**
 * Password login is intentionally fail-closed. The previous implementation
 * accepted any non-empty email/password pair and minted a token for user 1.
 */
export async function signin(input: SigninInput): Promise<AuthToken | null> {
  void input;
  return null;
}

export async function getUserFromToken(token: string) {
  const payload = await verifyToken(token);
  if (!payload) return null;

  return {
    id: payload.userId,
    email: payload.email,
    name: payload.email.split("@")[0],
    role: "user",
  };
}

/**
 * Password mutation requires persisted credentials and current-password
 * verification. Neither is configured in this legacy service.
 */
export async function changePassword(
  userId: number,
  oldPassword: string,
  newPassword: string
): Promise<boolean> {
  void userId;
  void oldPassword;
  void newPassword;
  return false;
}

/**
 * Reset delivery/storage is not configured, so no reset token is minted.
 */
export async function requestPasswordReset(
  email: string
): Promise<string | null> {
  void email;
  return null;
}

/**
 * Reset persistence is not configured. A token alone is not sufficient to
 * claim that a password was changed.
 */
export async function resetPassword(
  resetToken: string,
  newPassword: string
): Promise<boolean> {
  void resetToken;
  void newPassword;
  return false;
}

export default {
  signup,
  signin,
  createToken,
  verifyToken,
  getUserFromToken,
  changePassword,
  requestPasswordReset,
  resetPassword,
  hashPassword,
  verifyPassword,
};

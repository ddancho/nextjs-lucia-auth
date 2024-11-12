"use server";

import { ASSERT } from "@/asserts/assert";
import { isEnvValueNotEmptyString } from "@/asserts/assert";
import { createHash } from "crypto";
import querystring from "querystring";

export async function createVerifyEmailUrl(token: string) {
  ASSERT(
    isEnvValueNotEmptyString(process.env.SERVER_ADDRESS),
    "SERVER_ADDRESS throws error!"
  );
  const server = process.env.SERVER_ADDRESS;

  ASSERT(
    isEnvValueNotEmptyString(process.env.VERIFY_EMAIL_API_ENDPOINT),
    "VERIFY_EMAIL_API_ENDPOINT throws error!"
  );
  const apiEndPoint = process.env.VERIFY_EMAIL_API_ENDPOINT;

  const url = `${server}${apiEndPoint}?signature=${token}`;

  return url;
}

export async function createVerifiedExpiredToken(verifyExpiresAt: string) {
  ASSERT(
    isEnvValueNotEmptyString(process.env.SIGNATURE_SECRET),
    "SIGNATURE_SECRET throws error!"
  );
  const secret = process.env.SIGNATURE_SECRET;

  const token = createHash("sha1")
    .update(
      `${querystring.stringify({
        verifyExpiresAt,
      })}`
    )
    .update(secret)
    .digest("hex");

  return token;
}

"use server";

import { hashPassword } from "@/util/auth";
import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";
import { generateIdFromEntropySize } from "lucia";
import { ServerResponse, UserSignInSchema, UserSignUpSchema } from "@/types";
import { getErrorMessage } from "@/util/helpers";
import crypto from "crypto";
import prisma from "@/lib/prismaClient";
import validateRequest from "@/util/auth";
import { ASSERT } from "@/asserts/assert";
import { isEnvValueNotEmptyString } from "@/asserts/assert";
import {
  createVerifiedExpiredToken,
  createVerifyEmailUrl,
} from "@/actions/verifyToken";
import { SendEmailInfo } from "@/types";
import { sendEmail } from "@/actions/email";

export async function login(userData: unknown): Promise<ServerResponse> {
  const result = UserSignInSchema.safeParse(userData);
  let response: ServerResponse;

  if (!result.success) {
    let errorMessage = "";

    result.error.issues.forEach((issue) => {
      errorMessage = errorMessage + issue.path[0] + ": " + issue.message + ". ";
    });

    response = {
      status: "error",
      message: errorMessage,
    };

    return response;
  }

  try {
    // check email
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email: result.data.email,
        account: {
          isEmailVerified: true,
        },
      },
    });

    // check password
    const salt = user.salt;
    const hash = await hashPassword(result.data.password, salt);

    if (hash !== user.passwordHash) {
      response = {
        status: "error",
        message: "Incorrect email or password",
      };

      return response;
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    response = {
      status: "success",
      message: "User is successfully logged in",
    };

    return response;
  } catch (error: unknown) {
    response = {
      status: "error",
      message: getErrorMessage(error),
    };

    return response;
  }
}

export async function register(newUser: unknown): Promise<ServerResponse> {
  const result = UserSignUpSchema.safeParse(newUser);
  let response: ServerResponse;

  if (!result.success) {
    let errorMessage = "";

    result.error.issues.forEach((issue) => {
      errorMessage = errorMessage + issue.path[0] + ": " + issue.message + ". ";
    });

    response = {
      status: "error",
      message: errorMessage,
    };

    return response;
  }

  try {
    // check if the email is used
    const usedEmail = await prisma.user.findUnique({
      where: {
        email: result.data.email,
      },
    });

    if (usedEmail) {
      response = {
        status: "error",
        message: "Email is used",
      };

      return response;
    }

    // if not, insert new user in the db
    // prepare user info
    const salt = crypto.randomBytes(128).toString("base64");
    const passwordHash = await hashPassword(result.data.password, salt);
    const userId = generateIdFromEntropySize(10);

    // prepare account info
    // 2 min expire time
    ASSERT(
      isEnvValueNotEmptyString(process.env.VERIFY_EXPIRES_IN),
      "VERIFY_EXPIRES_IN throws error!"
    );

    // full date expiration timestamp
    const verifyExpiresAt = (
      Date.now() + parseInt(process.env.VERIFY_EXPIRES_IN)
    ).toString();

    const token = await createVerifiedExpiredToken(verifyExpiresAt);

    const verifyEmailUrl = await createVerifyEmailUrl(token);

    ASSERT(
      isEnvValueNotEmptyString(process.env.NO_REPLAY_EMAIL),
      "NO_REPLAY_EMAIL throws error!"
    );
    const fromNoReplay = process.env.NO_REPLAY_EMAIL;

    const textMsg = `Confirm your email address, Click me! : ${verifyEmailUrl}`;
    const htmlMsg = `
    <p>
        <a
          href="${verifyEmailUrl}" 
        >
          Confirm your email address, Click me!
        </a>
      </p>
    `;

    const email: SendEmailInfo = {
      from: fromNoReplay,
      to: result.data.email,
      subject: "Confirm email address",
      html: htmlMsg,
      text: textMsg,
    };

    // transaction, create account, user, send email
    // should rollback in the case of error
    await prisma.$transaction(async (tx) => {
      await tx.account.create({
        data: {
          token,
          verifyExpiresAt,
          user: {
            create: {
              id: userId,
              username: result.data.username,
              email: result.data.email,
              salt,
              passwordHash: passwordHash,
            },
          },
        },
      });

      await sendEmail(email);
    });

    response = {
      status: "success",
      message: "User is successfully created",
    };

    return response;
  } catch (error: unknown) {
    response = {
      status: "error",
      message: getErrorMessage(error),
    };

    return response;
  }
}

export async function logout(): Promise<ServerResponse> {
  let response: ServerResponse;

  const { session } = await validateRequest();
  if (!session) {
    response = {
      status: "error",
      message: "Unauthorized",
    };
    return response;
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  response = {
    status: "success",
    message: "User is successfully logged out",
  };
  return response;
}

import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prismaClient";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const signature = searchParams.get("signature");
  if (!signature || signature === "") {
    return NextResponse.redirect(new URL("/verify-email-error", request.url));
  }

  try {
    // find the token in the db and fetch account
    // email should not be validated
    const account = await prisma.account.findUniqueOrThrow({
      where: {
        token: signature,
        isEmailVerified: false,
      },
      select: {
        id: true,
        verifyExpiresAt: true,
      },
    });
    // TODO
    // we could create token with verifyExpiresAt and make extra hash check

    const now = Date.now();
    const verifyExpiresAt = parseInt(account.verifyExpiresAt);

    // heh, to late... 2 min pass
    if (now - verifyExpiresAt > 2 * 60 * 1000) {
      return NextResponse.redirect(new URL("/verify-email-error", request.url));
    }

    // update account
    await prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        isEmailVerified: true,
      },
    });

    return NextResponse.redirect(new URL("/verify-email-success", request.url));
  } catch {
    return NextResponse.redirect(new URL("/verify-email-error", request.url));
  }
}

"use server";

import { SendEmailInfo } from "@/types";
import transport from "@/lib/nodeMailerTransport";

export async function sendEmail(email: SendEmailInfo) {
  try {
    const response = await transport.sendMail(email);
    console.log("messageId:", response.messageId);
  } catch (error) {
    console.log("send email error", error);
  }
}

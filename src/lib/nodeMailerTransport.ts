import { mailhog } from "@/config/mailer";
import { ASSERT } from "@/asserts/assert";
import { isEnvValueNotEmptyString } from "@/asserts/assert";
import nodeMailer from "nodemailer";

ASSERT(
  isEnvValueNotEmptyString(process.env.NODE_ENV),
  "NODE_ENV throws error!"
);

function createNodeMailerTransport() {
  return nodeMailer.createTransport({
    host: mailhog.host,
    port: mailhog.port,
    secure: mailhog.secure,
  });
}

// access to global scope nodeMailerTransportGlobal is limited to this module only
declare const globalThis: {
  nodeMailerTransportGlobal: ReturnType<typeof createNodeMailerTransport>;
} & typeof global;

// single instance for the app run
const transport =
  globalThis.nodeMailerTransportGlobal ?? createNodeMailerTransport();

export default transport;

if (process.env.NODE_ENV !== "production")
  globalThis.nodeMailerTransportGlobal = transport;

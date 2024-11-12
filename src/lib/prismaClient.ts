import { PrismaClient } from "@prisma/client";
import { ASSERT } from "@/asserts/assert";
import { isEnvValueNotEmptyString } from "@/asserts/assert";

ASSERT(
  isEnvValueNotEmptyString(process.env.NODE_ENV),
  "NODE_ENV throws error!"
);

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

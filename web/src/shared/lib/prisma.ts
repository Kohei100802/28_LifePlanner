import { PrismaClient } from "@/generated/prisma";

declare global {
  // eslint-disable-next-line no-var
  var prismaClientSingleton: PrismaClient | undefined;
}

function getPrismaClient(): PrismaClient {
  if (!global.prismaClientSingleton) {
    global.prismaClientSingleton = new PrismaClient();
  }
  return global.prismaClientSingleton;
}

export const prisma = getPrismaClient();



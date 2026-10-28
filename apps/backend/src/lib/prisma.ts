import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import { env } from "../config/env";
import { PrismaClient } from "../generated/prisma/client";

import { createPgPoolConfig } from "./pgPoolConfig";
import { logger } from "./logger";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

const pool =
  globalForPrisma.pool ??
  new Pool(
    createPgPoolConfig({
      connectionString: env.databaseUrl,
      nodeEnv: process.env.NODE_ENV,
    }),
  );

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.pool = pool;
}

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export const pingDatabase = async (): Promise<void> => {
  await pool.query("SELECT 1");
};

export const connectPrisma = async () => {
  await prisma.$connect();
  logger.info("Prisma connected to database");
};

export const disconnectPrisma = async () => {
  await prisma.$disconnect();
  await pool.end();
};

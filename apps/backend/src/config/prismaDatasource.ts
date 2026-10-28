type DatasourceEnv = {
  DATABASE_URL?: string;
  DIRECT_URL?: string;
};

export const resolvePrismaDatasourceUrl = (
  env: DatasourceEnv = process.env,
): string => {
  const directUrl = env.DIRECT_URL?.trim();
  if (directUrl) {
    return directUrl;
  }

  const databaseUrl = env.DATABASE_URL?.trim();
  if (databaseUrl) {
    return databaseUrl;
  }

  throw new Error(
    "DATABASE_URL is required. For Neon migrations and seed, set DIRECT_URL to the non-pooled connection string.",
  );
};

import type { PoolConfig } from "pg";

export const PG_POOL_MAX = 5;

const TLS_SSLMODES = new Set(["require", "verify-ca", "verify-full"]);

export const shouldUsePgSsl = (
  connectionString: string,
  nodeEnv: string | undefined,
): boolean => {
  if (nodeEnv === "production") {
    return true;
  }

  try {
    const url = new URL(connectionString);
    const sslmode = url.searchParams.get("sslmode")?.toLowerCase();
    if (sslmode && TLS_SSLMODES.has(sslmode)) {
      return true;
    }

    const host = url.hostname.toLowerCase();
    return host === "neon.tech" || host.endsWith(".neon.tech");
  } catch {
    return false;
  }
};

export const createPgPoolConfig = (options: {
  connectionString: string;
  nodeEnv?: string;
}): PoolConfig => {
  const config: PoolConfig = {
    connectionString: options.connectionString,
    max: PG_POOL_MAX,
  };

  if (shouldUsePgSsl(options.connectionString, options.nodeEnv)) {
    config.ssl = { rejectUnauthorized: false };
  }

  return config;
};

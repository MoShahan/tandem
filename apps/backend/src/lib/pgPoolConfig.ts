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

const connectionStringForPg = (connectionString: string): string => {
  try {
    const url = new URL(connectionString);
    url.searchParams.delete("channel_binding");
    return url.toString();
  } catch {
    return connectionString;
  }
};

export const createPgPoolConfig = (options: {
  connectionString: string;
  nodeEnv?: string;
}): PoolConfig => {
  const useSsl = shouldUsePgSsl(options.connectionString, options.nodeEnv);
  const config: PoolConfig = {
    connectionString: connectionStringForPg(options.connectionString),
    max: PG_POOL_MAX,
  };

  if (useSsl) {
    config.ssl = { rejectUnauthorized: false };
    config.connectionTimeoutMillis = 30_000;
  }

  return config;
};

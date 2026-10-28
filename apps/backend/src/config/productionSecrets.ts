export const INSECURE_JWT_SECRET = "change-me";

export const assertSafeProductionSecrets = (options: {
  nodeEnv: string | undefined;
  jwtSecret: string;
}): void => {
  if (options.nodeEnv !== "production") {
    return;
  }

  if (options.jwtSecret === INSECURE_JWT_SECRET) {
    throw new Error(
      'JWT_SECRET must not be "change-me" in production. Set a long random value (e.g. openssl rand -base64 48).',
    );
  }
};

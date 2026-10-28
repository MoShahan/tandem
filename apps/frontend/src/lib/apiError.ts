import { ApiClientError, type ApiErrorDetail } from "@/lib/api-client";

export type ApiRejection = {
  message: string;
  details?: ApiErrorDetail[];
  code?: string;
  status?: number;
};

const EMPTY_MESSAGES = new Set(["", "Rejected", "An unexpected error occurred"]);

export const isApiRejection = (value: unknown): value is ApiRejection => {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof value.message === "string"
  );
};

const readStatus = (error: unknown): number | undefined => {
  if (error instanceof ApiClientError) {
    return error.status;
  }

  if (isApiRejection(error) && typeof error.status === "number") {
    return error.status;
  }

  return undefined;
};

export const getApiErrorDetails = (
  error: unknown,
): ApiErrorDetail[] | undefined => {
  if (error instanceof ApiClientError) {
    return error.details;
  }

  if (isApiRejection(error)) {
    return error.details;
  }

  return undefined;
};

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  const status = readStatus(error);

  if (status !== undefined && status >= 500) {
    return fallback;
  }

  let message: string | undefined;

  if (error instanceof ApiClientError || error instanceof Error) {
    message = error.message;
  } else if (isApiRejection(error)) {
    message = error.message;
  }

  if (!message || EMPTY_MESSAGES.has(message)) {
    return fallback;
  }

  return message;
};

export const toApiRejection = (error: unknown): ApiRejection => {
  if (error instanceof ApiClientError) {
    return {
      message: error.message,
      details: error.details,
      code: error.code,
      status: error.status,
    };
  }

  throw error;
};

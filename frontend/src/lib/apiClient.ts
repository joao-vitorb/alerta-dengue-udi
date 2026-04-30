import { env } from "../config/env";
import { ApiError } from "../errors/ApiError";

const apiBaseUrl = `${env.apiUrl}/api`;
const JSON_HEADERS = { "Content-Type": "application/json" } as const;

type QueryValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryValue>;

type RequestOptions = {
  query?: QueryParams;
  body?: unknown;
  signal?: AbortSignal;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      data?.message ?? "Request failed",
      response.status,
      data?.details ?? null,
    );
  }

  return data as T;
}

function buildUrl(path: string, query?: QueryParams): string {
  if (!query) {
    return `${apiBaseUrl}${path}`;
  }

  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;
    params.set(key, String(value));
  }

  const queryString = params.toString();

  return queryString
    ? `${apiBaseUrl}${path}?${queryString}`
    : `${apiBaseUrl}${path}`;
}

async function request<T>(
  method: string,
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const init: RequestInit = { method, signal: options.signal };

  if (options.body !== undefined) {
    init.headers = JSON_HEADERS;
    init.body = JSON.stringify(options.body);
  }

  const response = await fetch(buildUrl(path, options.query), init);

  return parseResponse<T>(response);
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>("GET", path, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("POST", path, { ...options, body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PATCH", path, { ...options, body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>("DELETE", path, options),
};

import { err, type ActionResult } from "@/lib/action-result";

function asRecord(error: unknown): Record<string, unknown> {
  if (error && typeof error === "object") return error as Record<string, unknown>;
  return {};
}

function collectErrorText(error: unknown): string {
  if (error == null) return "";
  if (typeof error === "string") return error;
  const rec = asRecord(error);
  const parts: string[] = [];
  for (const key of ["message", "digest", "code", "statusText", "name"] as const) {
    const value = rec[key];
    if (typeof value === "string") parts.push(value);
  }
  if (typeof rec.status === "number") parts.push(String(rec.status));
  const cause = rec.cause;
  if (cause && cause !== error) parts.push(collectErrorText(cause));
  return parts.join(" ");
}

export function describeAdminError(error: unknown): string {
  const rec = asRecord(error);
  const message = typeof rec.message === "string" ? rec.message : typeof error === "string" ? error : "";
  const digest = typeof rec.digest === "string" ? rec.digest : "";
  const status = typeof rec.status === "number" ? rec.status : undefined;
  const combined = `${collectErrorText(error)} ${digest}`.toLowerCase();

  if (
    status === 413 ||
    combined.includes("413") ||
    combined.includes("too large") ||
    combined.includes("function_payload_too_large") ||
    combined.includes("body exceeded") ||
    combined.includes("content too large") ||
    combined.includes("request entity too large")
  ) {
    return "The request was too large for the server. Large images and videos are uploaded directly to storage — refresh the page and try again.";
  }

  if (
    combined.includes("failed to fetch") ||
    combined.includes("networkerror") ||
    combined.includes("network request failed") ||
    combined.includes("load failed") ||
    combined.includes("err_network") ||
    combined.includes("err_internet_disconnected")
  ) {
    return "Network error. Check your connection and try again.";
  }

  if (combined.includes("unauthorized") || combined.includes("not authenticated")) {
    return "You are not signed in or your session expired. Sign in again and retry.";
  }

  if (combined.includes("forbidden") || combined.includes("csrf")) {
    return "This action was blocked for security reasons. Refresh the page, sign in, and try again.";
  }

  if (
    combined.includes("timeout") ||
    combined.includes("timed out") ||
    combined.includes("aborted") ||
    combined.includes("abort")
  ) {
    return "The request timed out. Try again, or use a smaller file.";
  }

  if (combined.includes("r2 is not configured")) {
    return "File storage is not configured on the server. Set the R2 environment variables and retry.";
  }

  if (message && !/internal server error|unexpected token|not valid json/i.test(message) && message.length < 400) {
    return message;
  }

  if (digest) {
    return `Something went wrong while saving (ref ${digest}). Try again.`;
  }

  return "Something went wrong. Try again.";
}

export async function runAdminAction<T = unknown>(
  fn: () => Promise<ActionResult<T>>
): Promise<ActionResult<T>> {
  try {
    const result = await fn();
    if (!result || typeof result !== "object" || !("ok" in result)) {
      return err("The server returned an unexpected response. Refresh and try again.");
    }
    return result;
  } catch (error) {
    return err(describeAdminError(error));
  }
}

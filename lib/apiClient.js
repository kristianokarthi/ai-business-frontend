const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://ai-agent-business-analysis-backend.vercel.app"
).replace(/\/$/, "");


export class APIRequestError extends Error {
  constructor(message, { status, code, retryAfter } = {}) {
    super(message);
    this.name = "APIRequestError";
    this.status = status;
    this.code = code || "request_failed";
    this.retryAfter = retryAfter || null;
  }
}


function parseError(body, status) {
  const detail = body?.detail;

  if (typeof detail === "string") {
    return { message: detail, code: "request_failed" };
  }

  if (detail?.message) {
    return {
      message: detail.message,
      code: detail.error_code || "request_failed",
    };
  }

  if (Array.isArray(detail)) {
    return {
      message: detail
        .map((item) => item.msg || "Invalid request")
        .join(", "),
      code: "validation_error",
    };
  }

  return {
    message: `The research service returned an error (${status}).`,
    code: "request_failed",
  };
}


export async function postJSON(path, payload, { signal } = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal,
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const error = parseError(body, response.status);
    throw new APIRequestError(error.message, {
      status: response.status,
      code: error.code,
      retryAfter: response.headers.get("retry-after"),
    });
  }

  return body;
}

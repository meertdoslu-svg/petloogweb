// Safe response parsing for form submit handlers.
//
// Root cause of "Unexpected end of JSON input": submit handlers used to call
// `await res.json()` unconditionally. Any response with an empty or
// non-JSON body — a platform-level 413 (request body too large, e.g. many
// 8MB files stacked in one multipart POST), a 204, a proxy/edge error page,
// or a network failure surfaced as an empty Response — made that call throw
// a raw parser exception straight into the UI instead of a Turkish,
// user-facing message. This helper never assumes a body is present or JSON.

export type ApiResult<T = unknown> = {
  ok: boolean;
  status: number;
  data: T | null;
  message: string;
};

const GENERIC_ERROR = "Başvuru gönderilemedi. Lütfen tekrar deneyin.";

export async function parseApiResponse<T = unknown>(
  res: Response,
): Promise<ApiResult<T>> {
  const contentType = res.headers.get("content-type") ?? "";
  let data: T | null = null;
  let rawText = "";

  try {
    rawText = await res.text();
  } catch {
    // Body stream failed (network cut mid-read) — fall through with no body.
  }

  if (rawText && contentType.includes("application/json")) {
    try {
      data = JSON.parse(rawText) as T;
    } catch {
      // Server claimed JSON but sent malformed/truncated body — treat as no
      // body rather than crashing the caller.
      data = null;
    }
  }

  if (res.ok) {
    return { ok: true, status: res.status, data, message: "" };
  }

  const backendMessage =
    data && typeof data === "object" && "message" in data
      ? String((data as { message?: unknown }).message ?? "")
      : "";

  // A real backend message is already Turkish/user-safe (see API routes) —
  // pass it through. Anything else (HTML error page, empty 413, raw stack
  // trace text) never reaches the UI.
  const message = backendMessage || GENERIC_ERROR;

  if (process.env.NODE_ENV !== "production") {
    console.error("[api]", res.status, contentType || "(no content-type)");
  }

  return { ok: false, status: res.status, data, message };
}

export async function submitFormData<T = unknown>(
  url: string,
  formData: FormData,
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, { method: "POST", body: formData });
    return await parseApiResponse<T>(res);
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[api] network error", err);
    }
    return { ok: false, status: 0, data: null, message: GENERIC_ERROR };
  }
}

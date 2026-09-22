const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function corsPreflight() {
  return new Response(null, { status: 204, headers: CORS });
}

export function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: CORS });
}

export function jsonError(message: string, status = 400) {
  return json({ error: message }, status);
}

export function text(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: {
      ...CORS,
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

export async function readJson(request: Request): Promise<unknown> {
  const textBody = await request.text();
  if (!textBody.trim()) return {};
  try {
    return JSON.parse(textBody) as unknown;
  } catch {
    throw new Error("JSON inválido");
  }
}

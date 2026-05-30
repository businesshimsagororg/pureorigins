import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = process.env.GOOGLE_SHEET_WEBHOOK_SECRET;
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  const authHeader = request.headers.get("authorization") || "";
  const bearer = authHeader.replace(/^Bearer\s+/i, "");

  if (secret && bearer !== secret && request.headers.get("x-webhook-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized webhook request." }, { status: 401 });
  }

  if (!webhookUrl) {
    return NextResponse.json({ error: "GOOGLE_SHEET_WEBHOOK_URL is not configured." }, { status: 500 });
  }

  const payload = await request.json();
  const url = new URL(webhookUrl);
  if (secret) url.searchParams.set("secret", secret);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(secret ? { Authorization: `Bearer ${secret}`, "X-Webhook-Secret": secret } : {})
    },
    body: JSON.stringify(secret ? { ...payload, secret } : payload)
  });

  const body = await response.text();
  return new NextResponse(body, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("content-type") || "application/json" }
  });
}

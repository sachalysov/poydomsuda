import { NextResponse } from "next/server";

/** Always evaluate at request time — avoids build-time empty env on App Platform. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getWebhookUrl(): string | undefined {
  // Bracket access + trim: not inlined as undefined during `next build`
  const raw = process.env["N8N_CHAT_WEBHOOK_URL"];
  const url = typeof raw === "string" ? raw.trim() : "";
  return url || undefined;
}

function extractReply(data: unknown): string | null {
  if (!data) return null;
  if (typeof data === "string") return data;

  if (Array.isArray(data)) {
    for (const item of data) {
      const reply = extractReply(item);
      if (reply) return reply;
    }
    return null;
  }

  if (typeof data === "object") {
    const obj = data as Record<string, unknown>;
    const candidates = [obj.output, obj.text, obj.response, obj.message];
    for (const value of candidates) {
      if (typeof value === "string" && value.trim()) return value;
    }
  }

  return null;
}

export async function POST(request: Request) {
  const webhookUrl = getWebhookUrl();

  if (!webhookUrl) {
    console.error("[chat] N8N_CHAT_WEBHOOK_URL is missing at runtime");
    return NextResponse.json(
      { error: "Чат временно недоступен: вебхук не настроен." },
      { status: 503 },
    );
  }

  let body: { message?: unknown; sessionId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос." }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  const sessionId =
    typeof body.sessionId === "string" && body.sessionId.trim()
      ? body.sessionId.trim()
      : crypto.randomUUID();

  if (!message) {
    return NextResponse.json({ error: "Сообщение не может быть пустым." }, { status: 400 });
  }

  try {
    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "sendMessage",
        sessionId,
        chatInput: message,
      }),
      cache: "no-store",
    });

    const rawText = await upstream.text();
    let data: unknown = null;
    if (rawText) {
      try {
        data = JSON.parse(rawText);
      } catch {
        data = rawText;
      }
    }

    if (!upstream.ok) {
      const hint =
        typeof data === "object" && data && "message" in data
          ? String((data as { message: unknown }).message)
          : rawText || upstream.statusText;

      console.error("[chat] n8n webhook error:", upstream.status, hint);
      return NextResponse.json(
        {
          error:
            upstream.status === 404
              ? "Вебхук чата не активен. Активируйте workflow в n8n."
              : "Не удалось получить ответ от AI. Попробуйте ещё раз.",
        },
        { status: 502 },
      );
    }

    const reply =
      extractReply(data) ??
      "Получил ваш вопрос, но не смог сформировать ответ. Попробуйте переформулировать.";

    return NextResponse.json({ reply, sessionId });
  } catch (error) {
    console.error("[chat] n8n webhook request failed:", error);
    return NextResponse.json(
      { error: "Ошибка соединения с AI. Попробуйте чуть позже." },
      { status: 502 },
    );
  }
}

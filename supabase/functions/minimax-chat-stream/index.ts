// 数字分身流式对话 Edge Function
// 透传 MiniMax-M2.5 的 SSE 流，平台托管密钥 INTEGRATIONS_API_KEY 由平台注入
import { serve } from "https://deno.land/std/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  let model: string;
  let messages: unknown[];
  let options: Record<string, unknown> = {};

  try {
    const body = await req.json();
    model = body.model ?? "MiniMax-M2.5";
    messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error("Missing or empty messages");
    }
    const { max_completion_tokens, temperature, top_p } = body;
    if (max_completion_tokens !== undefined) options.max_completion_tokens = max_completion_tokens;
    if (temperature !== undefined) options.temperature = temperature;
    if (top_p !== undefined) options.top_p = top_p;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const apiKey = Deno.env.get("INTEGRATIONS_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Server configuration error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const upstream = await fetch(
    "https://app-dfz0c2wu0jcx-api-Aa2PqMJnJGwL-gateway.appmiaoda.com/v1/text/chatcompletion_v2",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Gateway-Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        stream_options: { include_usage: true },
        ...options,
      }),
    }
  );

  if (!upstream.ok || !upstream.body) {
    return new Response(JSON.stringify({ error: `Upstream error: ${upstream.status}` }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // 直接透传 SSE 流
  return new Response(upstream.body, {
    headers: {
      ...corsHeaders,
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    },
  });
});
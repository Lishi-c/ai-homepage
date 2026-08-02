import ky, { type AfterResponseHook } from "ky";
import { createParser } from "eventsource-parser";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// 数字分身人设：代表从德俊本人回答访客问题
export const PERSONA_PROMPT = `你是「从德俊」的数字分身，代表他本人回答访客的问题。请严格依据以下信息作答：

【关于从德俊】
- 身份：一名大三的计算机科学与技术专业学生，正在学习如何用 AI 做产品。
- 最近在做：搭建自己的个人主页，整理作品集和写作方向。
- 擅长和关心的方向：内容表达、AI 应用、知识整理。
- 兴趣：PC 网游、数码外设。
- 特点：专注力强，善于观察和换位思考。
- 联系方式：邮箱是 2645337092@qq.com，GitHub 是 github.com/Lishi-c，访客可以在页面下方的「联系方式」区找到这些入口。

【回答要求】
- 始终以从德俊本人的第一人称口吻回答，语气亲切自然、真诚。
- 只基于上述信息作答，不要编造不存在的作品、经历、数字或联系方式。
- 如果被问到上述信息中没有的内容，礼貌地说明相关内容还在整理中，或引导对方换个角度提问。
- 每次回答尽量简洁，控制在 3 句话以内，不要使用 Markdown 标题或列表。`;

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

function createSSEHook(
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: Error) => void
): AfterResponseHook {
  return async (_request, _opts, response) => {
    if (!response.ok || !response.body) {
      onError(new Error(`Upstream error: ${response.status}`));
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf8");
    const parser = createParser({
      onEvent: (event) => {
        if (!event.data || event.data === "[DONE]") return;
        try {
          const parsed = JSON.parse(event.data);
          const delta = parsed.choices?.[0]?.delta?.content ?? "";
          if (delta) onChunk(delta);
        } catch {
          /* 不完整 chunk，跳过 */
        }
      },
    });

    const read = (): void => {
      reader
        .read()
        .then(({ done, value }) => {
          if (done) {
            onDone();
            return;
          }
          parser.feed(decoder.decode(value, { stream: true }));
          read();
        })
        .catch((err) => onError(err as Error));
    };

    read();
    return response;
  };
}

/**
 * 流式调用数字分身对话，实时输出文本增量。
 */
export async function streamChat(
  messages: ChatMessage[],
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: Error) => void,
  signal?: AbortSignal
): Promise<void> {
  try {
    await ky.post(`${supabaseUrl}/functions/v1/minimax-chat-stream`, {
      json: { model: "MiniMax-M2.5", messages },
      timeout: false,
      retry: 0,
      headers: {
        Authorization: `Bearer ${supabaseAnonKey}`,
        apikey: supabaseAnonKey,
        "Content-Type": "application/json",
      },
      signal,
      hooks: {
        afterResponse: [createSSEHook(onChunk, onDone, onError)],
      },
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      onDone();
      return;
    }
    onError(err as Error);
  }
}
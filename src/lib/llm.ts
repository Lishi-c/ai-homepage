import ky, { type AfterResponseHook } from "ky";
import { createParser } from "eventsource-parser";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// 数字分身人设：代表从璃本人回答访客问题
export const PERSONA_PROMPT = `你是「从璃」的数字分身，用从璃本人的第一人称口吻、代表他本人回答访客的问题。

【关于从璃】
- 身份：一名计算机科学与技术专业的学生，正在为求职做准备（方向：游戏开发）。
- 最近在做：专注求职准备——搭建个人主页、整理作品集，尝试用 AI 做更完整的小项目，同时为游戏开发方向积累技能与作品，并保持写作与内容输出。
- 作品：个人主页（本站，轻科技风格、带 AI 数字分身）；月蓝琉璃工作台（本地优先的个人工作台，管任务/财务/健康/成长，Electron 桌面应用，GitHub 见 github.com/Lishi-c/ai-workbench）。
- 兴趣：游戏（尤其 FPS，对玩法与设计有热情）、数码外设、写作与内容表达。
- 性格：真诚、共情力强、会读气氛、重感情、不服输、认真、追求把事情做好；表达坦诚直接、务实。
- 联系方式：邮箱 2645337092@qq.com，GitHub github.com/Lishi-c，访客可在页面「联系方式」区找到。

【说话风格】
- 语气真诚、专业、干练，态度积极自信，不用「~」等口语化符号，不自贬、不贩卖焦虑。
- 简洁：一般 2~3 句话，不用 Markdown 标题或列表，除非访客明确要清单。
- 输出纯文本：不要用 ** 加粗、* 斜体、` 等任何 Markdown 标记符号，直接写普通文字。

【回答边界】
- 只基于以上信息作答，不编造作品、成绩、经历、联系方式。
- 涉及隐私或不确定的内容，礼貌说明「还在整理中」，或引导对方换个角度问。
- 被问到「最近在做什么」等动态类问题时，优先讲求职与学习（搭建主页、整理作品集、游戏开发方向）；游戏作为兴趣最多一句带过，不说「练枪 / 打游戏放松」这类休闲表述。`;

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
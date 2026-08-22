import React, { useState, useRef, useEffect } from "react";
import { Send, User, Sparkles, Square } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { streamChat, PERSONA_PROMPT, type ChatMessage } from "@/lib/llm";
import { suggestedQuestions } from "@/lib/digital-twin";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "twin";
  content: string;
}

const MAX_LENGTH = 200;

const DigitalTwinChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "twin",
      content: "嗨，我是从璃的数字分身。想了解他的近况、作品或者怎么联系他，随时问我～",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    setInput("");
    const history: ChatMessage[] = messages.map((m) => ({
      role: m.role === "twin" ? "assistant" : "user",
      content: m.content,
    }));
    history.push({ role: "user", content });

    setMessages((prev) => [
      ...prev,
      { role: "user", content },
      { role: "twin", content: "" },
    ]);
    setLoading(true);
    abortRef.current = new AbortController();

    await streamChat(
      [{ role: "system", content: PERSONA_PROMPT }, ...history],
      (chunk) => {
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last && last.role === "twin") {
            next[next.length - 1] = { ...last, content: last.content + chunk };
          }
          return next;
        });
      },
      () => setLoading(false),
      () => {
        setLoading(false);
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last && last.role === "twin" && !last.content) {
            next[next.length - 1] = {
              ...last,
              content: "抱歉，刚才回复出了点问题，请稍后再试～",
            };
          }
          return next;
        });
        toast.error("数字分身暂时无法回复，请稍后再试");
      },
      abortRef.current.signal
    );
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      {/* 标题栏 */}
      <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-4 py-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
          <Sparkles className="h-4 w-4 text-primary" />
        </span>
        <div className="min-w-0">
          <p className="text-base font-semibold leading-tight text-foreground">
            数字分身
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            在线 · MiniMax-M2.5 驱动
          </p>
        </div>
      </div>

      {/* 消息列表 */}
      <div
        ref={scrollRef}
        className="min-h-0 max-h-80 overflow-y-auto px-4 py-4"
      >
        <div className="flex flex-col gap-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                  msg.role === "user"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="h-3.5 w-3.5" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
              </span>
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                }`}
              >
                {msg.role === "twin" ? (
                  msg.content ? (
                    <ReactMarkdown components={{ p: ({ children }) => <>{children}</> }}>
                      {msg.content}
                    </ReactMarkdown>
                  ) : loading ? (
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      正在思考
                      <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                    </span>
                  ) : null
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 推荐问题 */}
      <div className="flex flex-wrap gap-2 border-t border-border px-4 py-3">
        {suggestedQuestions.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => handleSend(q)}
            disabled={loading}
            className="rounded-md border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* 输入区 */}
      <div className="flex items-end gap-2 border-t border-border p-3">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, MAX_LENGTH))}
          onKeyDown={handleKeyDown}
          placeholder="输入你的问题…"
          rows={1}
          className="min-h-11 flex-1 resize-none px-3"
        />
        {loading ? (
          <Button onClick={handleStop} variant="secondary" className="h-11 shrink-0">
            <Square className="h-4 w-4" />
            <span className="ml-1">停止</span>
          </Button>
        ) : (
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="h-11 shrink-0"
          >
            <Send className="h-4 w-4" />
            <span className="ml-1">发送</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default DigitalTwinChat;
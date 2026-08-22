import React from "react";
import { BookOpen, Gamepad2, Eye, Mail, Github, ExternalLink, FolderGit2 } from "lucide-react";
import DigitalTwinChat from "@/components/home/DigitalTwinChat";

const AVATAR_URL = "/images/avatar.jpg";

const infoItems = [
  {
    icon: BookOpen,
    label: "现在主要在做",
    value: "求职准备：搭建主页、整理作品集、用 AI 做小项目，往游戏开发方向走",
    tone: "sky" as const,
  },
  {
    icon: Gamepad2,
    label: "我的兴趣",
    value: "游戏（尤其射击类）、数码外设、写作",
    tone: "green" as const,
  },
  {
    icon: Eye,
    label: "一个有记忆点的特点",
    value: "共情力强、会读气氛，重感情、认真务实",
    tone: "sky" as const,
  },
];

// 真实可点击的联系方式
const contacts = [
  {
    icon: Mail,
    label: "邮箱",
    value: "2645337092@qq.com",
    href: "mailto:2645337092@qq.com",
    tone: "sky" as const,
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/Lishi-c",
    href: "https://github.com/Lishi-c",
    tone: "green" as const,
  },
];

const projects = [
  {
    icon: FolderGit2,
    name: "个人主页 v1",
    description: "轻科技风格个人站点，集成 AI 数字分身，支持流式对话",
    href: "https://github.com/Lishi-c",
    tone: "sky" as const,
  },
  {
    icon: FolderGit2,
    name: "月蓝琉璃工作台",
    description: "个人工作台，管理任务、日记、笔记与图书库，支持 Markdown 编辑与渲染",
    href: "https://github.com/Lishi-c/ai-workbench",
    tone: "green" as const,
  },
  {
    icon: FolderGit2,
    name: "作品整理中",
    description: "更多项目正在整理，敬请期待",
    tone: "sky" as const,
  },
];

const HomePage: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full">
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-8 md:px-10 md:py-10">
        {/* 头像 + 名字 + 一句话介绍 */}
        <header className="flex flex-col items-center text-center md:flex-row md:items-center md:text-left md:gap-8">
          {/* 头像 */}
          <div className="relative shrink-0">
            <div className="h-20 w-20 overflow-hidden rounded-full md:h-24 md:w-24">
              <img
                src={AVATAR_URL}
                alt="从璃的头像"
                className="h-full w-full object-cover"
              />
            </div>
            {/* 在线状态微光点 */}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-background bg-accent">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent-foreground/80" />
            </span>
          </div>

          {/* 文字区 */}
          <div className="mt-5 md:mt-0">
            {/* 等宽科技标签 */}
            <span className="font-mono-tech text-[11px] tracking-[0.2em] text-muted-foreground/60">
              CS STUDENT · v1
            </span>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              从璃
            </h1>
            <p className="mt-2.5 max-w-prose text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
              一个正在往游戏开发方向求职的计算机专业学生
            </p>
          </div>
        </header>

        {/* 细线分割 */}
        <div className="mt-8 border-t border-border/50 md:mt-10" />

        {/* 桌面端双栏：左 = 个人信息 + 作品 + 联系方式，右 = 数字分身 */}
        <div className="mt-8 grid grid-cols-1 gap-y-8 md:mt-10 md:grid-cols-12 md:gap-x-14 md:gap-y-0">
          {/* 左栏 */}
          <div className="md:col-span-7">
            {/* 个人信息展示区 */}
            <section>
              <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground/60">
                关于我
              </h2>
              <div className="mt-4 flex flex-col">
                {infoItems.map((item, i) => (
                  <div
                    key={item.label}
                    className={`flex items-start gap-4 py-4 ${
                      i < infoItems.length - 1 ? "border-b border-border/40" : ""
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
                        item.tone === "sky"
                          ? "bg-primary/10 text-primary"
                          : "bg-accent/10 text-accent"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-xs text-muted-foreground/70">
                        {item.label}
                      </p>
                      <p className="mt-1 text-base leading-relaxed text-foreground">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 作品展示区 */}
            <section className="mt-6">
              <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground/60">
                作品
              </h2>
              <div className="mt-4 flex flex-col">
                {projects.map((item, i) => (
                  <div
                    key={item.name}
                    className={`flex items-start gap-4 py-4 ${
                      i < projects.length - 1 ? "border-b border-border/40" : ""
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
                        item.tone === "sky"
                          ? "bg-primary/10 text-primary"
                          : "bg-accent/10 text-accent"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="text-base leading-relaxed text-foreground">
                        {item.name}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground/70">
                        {item.description}
                      </p>
                    </div>
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 self-center rounded p-1 text-muted-foreground/40 transition-colors hover:text-primary"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>

            {/* 联系方式区 */}
            <section className="mt-6">
              <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground/60">
                联系方式
              </h2>
              <div className="mt-4 flex flex-col">
                {contacts.map((item, i) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("mailto") ? undefined : "_blank"}
                    rel={item.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                    className={`group flex items-center gap-4 py-4 transition-colors hover:text-primary ${
                      i < contacts.length - 1 ? "border-b border-border/40" : ""
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-colors ${
                        item.tone === "sky"
                          ? "bg-primary/10 text-primary group-hover:bg-primary/15"
                          : "bg-accent/10 text-accent group-hover:bg-accent/15"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground/70">
                        {item.label}
                      </p>
                      <p className="mt-1 truncate text-base text-foreground transition-colors group-hover:text-primary">
                        {item.value}
                      </p>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-primary" />
                  </a>
                ))}
              </div>
            </section>
          </div>

          {/* 右栏：数字分身 */}
          <div className="md:col-span-5">
            <div className="md:sticky md:top-10">
              <div className="mb-4 flex items-center gap-2">
                <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground/60">
                  数字分身
                </h2>
                <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent chat-badge-glow">
                  <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                  在线，可直接聊
                </span>
              </div>
              <DigitalTwinChat />
            </div>
          </div>
        </div>

        {/* 页脚 */}
        <footer className="mt-10 text-center md:mt-12">
          <p className="font-mono-tech text-[11px] text-muted-foreground/40">
            个人主页-v1 · 从璃
          </p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
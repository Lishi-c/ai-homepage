import React from "react";
import { BookOpen, Gamepad2, Cpu, Eye, Mail, Github, Globe, ExternalLink } from "lucide-react";
import DigitalTwinChat from "@/components/home/DigitalTwinChat";

const AVATAR_URL =
  "https://miaoda-site-img.cdn.bcebos.com/images/MiaoTu_07246e5d-206a-46ff-a808-c8a13e686c87.jpg";

const infoItems = [
  {
    icon: BookOpen,
    label: "现在主要在做",
    value: "整理自己的作品和写作方向",
    tone: "sky" as const,
  },
  {
    icon: Gamepad2,
    label: "我的兴趣",
    value: "PC 网游、数码外设",
    tone: "green" as const,
  },
  {
    icon: Eye,
    label: "一个有记忆点的特点",
    value: "专注力强，善于观察换位思考",
    tone: "sky" as const,
  },
];

// 真实可点击的联系方式（请替换为你自己的账号）
const contacts = [
  {
    icon: Mail,
    label: "邮箱",
    value: "dejun@example.com",
    href: "mailto:dejun@example.com",
    tone: "sky" as const,
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/dejun",
    href: "https://github.com",
    tone: "green" as const,
  },
  {
    icon: Globe,
    label: "个人主页",
    value: "dejun.dev",
    href: "https://dejun.dev",
    tone: "sky" as const,
  },
];

const HomePage: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full">
      <div className="relative z-10 mx-auto w-full max-w-2xl px-4 py-10 md:py-16">
        {/* 头像 + 名字 + 一句话介绍 */}
        <header className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="h-28 w-28 overflow-hidden rounded-lg border border-border bg-muted shadow-sm md:h-32 md:w-32">
              <img
                src={AVATAR_URL}
                alt="从德俊的头像"
                className="h-full w-full object-cover"
              />
            </div>
            {/* 在线状态微光点 */}
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-accent">
              <span className="pulse-dot h-2 w-2 rounded-full bg-accent-foreground/80" />
            </span>
          </div>

          {/* 等宽科技标签 */}
          <span className="font-mono-tech mt-6 rounded-md bg-secondary px-2.5 py-1 text-xs tracking-widest text-primary">
            CS&nbsp;STUDENT&nbsp;·&nbsp;v1
          </span>

          <h1 className="mt-4 text-3xl font-semibold tracking-wide text-foreground md:text-4xl">
            从德俊
          </h1>
          <p className="mt-3 max-w-prose text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
            一个正在学习用 AI 做产品的大三计科学生
          </p>

          {/* 细线分割 */}
          <div className="mt-8 flex items-center gap-3">
            <span className="h-px w-12 bg-border" />
            <Cpu className="h-4 w-4 text-accent" />
            <span className="h-px w-12 bg-border" />
          </div>
        </header>

        {/* 个人信息展示区 */}
        <section className="mt-12">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-primary" />
            <h2 className="text-lg font-semibold text-foreground">关于我</h2>
          </div>
          <div className="flex flex-col gap-3">
            {infoItems.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-sm transition-colors hover:border-primary/40"
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
                <div className="min-w-0">
                  <p className="font-mono-tech text-xs uppercase tracking-wide text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-foreground">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 联系方式区 */}
        <section className="mt-10">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-accent" />
            <h2 className="text-lg font-semibold text-foreground">联系方式</h2>
          </div>
          <div className="flex flex-col gap-3">
            {contacts.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("mailto") ? undefined : "_blank"}
                rel={item.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className="group flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-sm transition-colors hover:border-primary/50"
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
                <div className="min-w-0 flex-1">
                  <p className="font-mono-tech text-xs uppercase tracking-wide text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-0.5 truncate text-sm text-foreground">
                    {item.value}
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
              </a>
            ))}
          </div>
        </section>

        {/* 数字分身聊天区 */}
        <section className="mt-10">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-primary" />
            <h2 className="text-lg font-semibold text-foreground">数字分身</h2>
          </div>
          <DigitalTwinChat />
        </section>

        {/* 页脚 */}
        <footer className="mt-12 text-center">
          <p className="font-mono-tech text-xs text-muted-foreground">
            个人主页-v1 · 从德俊
          </p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
/**
 * Tailwind CSS 语法检查（跨平台）
 *
 * 原实现为 `npx tailwindcss -i ./src/index.css -o /dev/null | grep -E '^(CssSyntaxError|Error):'`，
 * 存在两个平台相关缺陷：
 *   1. Windows 上 `/dev/null` 会被当成字面文件名，生成删不掉的保留设备名文件 `nul`；
 *   2. PATH 中没有 `grep` 时命令直接失败，且分号会让后续检查被静默跳过。
 *
 * 现改为写入系统临时文件并读取，不依赖任何 Unix 工具。
 */
import { execSync } from "node:child_process";
import { rmSync } from "node:fs";
import { join } from "node:path";

// Windows 下 .cmd 必须经 shell 启动，故用命令字符串而非 execFileSync + shell:true，
// 以避免 Node 24 的 DEP0190 弃用告警（路径为本文件内的常量，不涉及外部输入）。
const INPUT = "./src/index.css";
const OUT = join(
  process.env.TEMP || process.env.TMPDIR || "/tmp",
  "tailwind-check.css"
);
const BIN = join(
  "node_modules",
  ".bin",
  `tailwindcss${process.platform === "win32" ? ".cmd" : ""}`
);

/** 与原 grep 保持一致的致命错误识别规则 */
const FATAL = /^(CssSyntaxError|Error):/;

let stderr = "";
let failed = false;

try {
  execSync(`"${BIN}" -i ${INPUT} -o "${OUT}"`, {
    stdio: ["ignore", "ignore", "pipe"],
    encoding: "utf8",
  });
} catch (err) {
  // 区分「无法启动子进程」与「tailwind 报告了错误」：前者必须显式失败，
  // 否则会被下面「无致命行则不报错」的规则吞掉，产生假绿。
  if (err?.status == null || err?.status === 0) {
    console.error("无法启动 tailwindcss 检查：", err?.message ?? err);
    console.error("这不代表 CSS 检查通过，请检查依赖是否已安装。");
    process.exit(2);
  }
  failed = true;
  stderr = String(err?.stderr ?? err?.message ?? "");
} finally {
  try {
    rmSync(OUT, { force: true });
  } catch {
    /* 临时文件清理失败不影响检查结果 */
  }
}

// 非零退出且匹配到致命错误才判失败，避免把普通告警误报为错误
const hits = stderr.split(/\r?\n/).filter((line) => FATAL.test(line));

if (failed && hits.length > 0) {
  console.error("Tailwind CSS 检查未通过：\n");
  console.error(stderr.trim());
  process.exit(1);
}

console.log("Tailwind CSS 检查通过");

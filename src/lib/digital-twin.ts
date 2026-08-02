// 数字分身知识库与回复逻辑
// 基于预设信息回答访客问题，支持关键词匹配与兜底回复

interface Knowledge {
  identity: string;
  doing: string;
  skills: string;
  interests: string;
  contact: string;
}

const knowledge: Knowledge = {
  identity: "我是一名大三的计算机科学与技术专业学生，目前正在学习如何用 AI 做产品。",
  doing: "我现在主要在做两件事：一是搭建自己的个人主页，二是整理作品集和写作方向。",
  skills: "我擅长和关心的方向是内容表达、AI 应用和知识整理。",
  interests: "我的兴趣是 PC 网游和数码外设。",
  contact: "你可以通过页面上的联系方式与我取得联系，也欢迎在下方留言交流。",
};

interface Rule {
  keywords: string[];
  answer: string;
}

const rules: Rule[] = [
  {
    keywords: ["在做什么", "做什么", "最近", "忙", "在忙"],
    answer: knowledge.doing,
  },
  {
    keywords: ["作品", "项目", "案例", "经历", "做过"],
    answer:
      "我正在整理自己的作品集，目前主要围绕内容表达、AI 应用和知识整理这些方向。作品集正在陆续完善中，欢迎持续关注。",
  },
  {
    keywords: ["联系", "联系方式", "怎么联系", "邮箱", "微信", "找你"],
    answer: knowledge.contact,
  },
  {
    keywords: ["你是谁", "介绍", "身份", "职业", "专业", "学生", "谁"],
    answer: knowledge.identity,
  },
  {
    keywords: ["擅长", "方向", "技能", "会什么", "能力", "关心"],
    answer: knowledge.skills,
  },
  {
    keywords: ["兴趣", "爱好", "喜欢", "游戏", "数码"],
    answer: knowledge.interests,
  },
];

export function getDigitalTwinReply(question: string): string {
  const q = question.trim();
  if (!q) return "请输入你想问的问题～";

  for (const rule of rules) {
    if (rule.keywords.some((kw) => q.includes(kw))) {
      return rule.answer;
    }
  }

  return "抱歉，我暂时无法回答这个问题，你可以换个方式问问看～比如问我「你现在在做什么？」「你有哪些作品？」或「怎么联系你？」";
}

export const suggestedQuestions = [
  "你现在在做什么？",
  "你有哪些作品？",
  "怎么联系你？",
];
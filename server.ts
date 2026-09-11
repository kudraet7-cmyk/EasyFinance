import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI lazily if API key exists, supporting custom key
function getAiClient(customKey?: string): GoogleGenAI | null {
  const key = customKey?.trim() || process.env.GEMINI_API_KEY;
  if (key) {
    return new GoogleGenAI({ apiKey: key });
  }
  return null;
}

// Endpoint to verify user custom API key
app.post("/api/verify-key", async (req: Request, res: Response) => {
  try {
    const { apiKey } = req.body;
    if (!apiKey || typeof apiKey !== "string") {
      res.status(400).json({ valid: false, message: "API key is required" });
      return;
    }
    const testClient = new GoogleGenAI({ apiKey: apiKey.trim() });
    const testResponse = await testClient.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [{ role: "user", parts: [{ text: "ping" }] }]
    });
    if (testResponse && testResponse.text) {
      res.json({ valid: true, message: "Key verified successfully" });
    } else {
      res.json({ valid: false, message: "Key verification did not return text" });
    }
  } catch (err: any) {
    console.error("Key verification failed:", err?.message || err);
    res.status(400).json({ valid: false, message: err?.message || "Invalid API key" });
  }
});

// Built-in Knowledge Base & Financial Terminology Dictionary (Offline Fallback & Ground Truth)
interface TermKnowledge {
  term: string;
  category: "kline" | "fund" | "financial_planning" | "report" | "insurance";
  plainText: string;
  formalDefinition: string;
  formula?: string;
}

const DEFAULT_TERMS: Record<string, TermKnowledge> = {
  "macd": {
    term: "MACD (平滑异同移动平均线)",
    category: "kline",
    plainText: "MACD本质是一个数学'测速计'。它通过计算短期移动均线（默认12天）与长期移动均线（默认26天）的差离值（DIF），观察价格变动的势能和速度是加速还是放缓。指标交叉体现两条均线在数学维度的交汇，反映历史价格变动的动能状态。",
    formalDefinition: "Moving Average Convergence Divergence，由Gerald Appel提出。利用收盘价指数移动平均（EMA）的离差值（DIF）与平滑离差值（DEA）构建，柱状图反映两者差值。",
    formula: "DIF = EMA(12) - EMA(26); DEA = EMA(DIF, 9); MACD柱 = 2 × (DIF - DEA)"
  },
  "k线": {
    term: "K线 (蜡烛图 / 阴阳线)",
    category: "kline",
    plainText: "一根K线是将特定周期（如日度、小时）内的四个关键价格点绘制为一个图元：开盘价、收盘价、最高价、最低价。实体部分反映开盘与收盘的区间幅度，上下伸出的细线（影线）记录日内的极值价格，客观呈现历史交易区间的分布。",
    formalDefinition: "直观展现交易周期的开盘(Open)、最高(High)、最低(Low)、收盘(Close)四要素。收盘价高于开盘价通常绘制为阳线，反之绘制为阴线。",
    formula: "实体高度 = |Close - Open|; 上影线 = High - max(Open, Close); 下影线 = min(Open, Close) - Low"
  },
  "移动平均线": {
    term: "MA (移动平均线)",
    category: "kline",
    plainText: "计算过去N个周期的收盘价算术平均值所连成的连续曲线。核心作用在于过滤日常偶发的价格噪点，观察中短期持仓成本的平均中枢位置。",
    formalDefinition: "Moving Average。根据时间跨度常见有MA5、MA10、MA20、MA60等，是量化统计中消除高频噪音的基础平滑工具。",
    formula: "MA(N) = (P_1 + P_2 + ... + P_N) / N"
  },
  "管理费": {
    term: "公募基金管理费 & 托管费",
    category: "fund",
    plainText: "管理费按年化费率计提，每日直接从基金总资产净值中按比例扣除，无论当日基金净值涨跌均会扣除。投资者看到的每日基金净值已经是扣除管理费与托管费后的净结果，无需另行转账支付。",
    formalDefinition: "基金管理人为运作基金资产收取的报酬，以及基金托管人保管资产收取的费用。通常按前一日资产净值每日计提、按月支付。",
    formula: "每日计提管理费 = (前一日基金资产净值 × 年管理费率) / 当年实际天数(365)"
  },
  "年化利率": {
    term: "名义利率 vs 内部收益率 (IRR 真实年化)",
    category: "financial_planning",
    plainText: "分期平台常宣传'月费率0.5%'，表面看起来年化仅 6%，但由于每月都在偿还本金，借款人实际占用本金逐月递减，而利息始终按全额本金计算。内部收益率（IRR）折现后实际真实年化通常在 10%~12% 左右。",
    formalDefinition: "依据中国人民银行关于统一贷款年化利率明示规定，统一采用内部收益率（IRR）计算，指使未来现金流净现值(NPV)等于零的折现率。",
    formula: "NPV = ∑ [ C_t / (1 + IRR)^t ] = 0"
  },
  "等额本息": {
    term: "等额本息 vs 等额本金",
    category: "financial_planning",
    plainText: "等额本息每月还款总金额固定，前期月供中利息占大头、本金还很少；等额本金则是每月偿还本金固定，利息随本金减少逐月递减，前期还款压力大、后期逐步减轻。总利息支出上等额本金更少，等额本息前期资金压力更平稳。",
    formalDefinition: "个人贷款的两种基础还款模型。等额本息(Amortized Loan With Equal Installments)与等额本金(Equal Principal Payments)。",
    formula: "等额本息月供 = [本金 × 月利率 × (1+月利率)^期数] / [(1+月利率)^期数 - 1]"
  },
  "商誉减值": {
    term: "财报术语 - 商誉减值 (Goodwill Impairment)",
    category: "report",
    plainText: "指企业并购时付出的溢价资产出现缩水。例如A公司花10亿收购了净资产仅2亿的B公司，多付的8亿作为商誉计入资产负债表。若随后B公司经营业绩未达预期，A公司须对多记的资产计提减值计入当期损益，导致利润表净利大幅下滑。",
    formalDefinition: "企业非同一控制下合并形成的商誉，每年至少进行一次减值测试。可收回金额低于账面价值时确认为商誉减值损失，一经确认以后期间不得转回。",
    formula: "初始商誉 = 合并对价 - 被购买方可辨认净资产公允价值份额"
  },
  "市盈率": {
    term: "PE (市盈率 / Price-to-Earnings Ratio)",
    category: "report",
    plainText: "衡量股票当前价格与每股收益的比率。通俗理解就是：如果公司未来每年赚的钱保持不变，按现在的市值把整家公司买下来，大约需要多少年能收回投资成本。通常分为静态PE、动态PE和滚动PE(TTM)。",
    formalDefinition: "股票市价与每股收益(EPS)的比率，或公司总市值与归母净利润的比率。反映市场对该资产盈利能力的估值溢价倍数。",
    formula: "PE = 当前股价 / 每股收益 (EPS) = 总市值 / 净利润"
  }
};

// Real-time financial bulletin mock/live objective news
const FINANCIAL_BULLETINS = [
  {
    id: "nb-001",
    time: "10:15",
    type: "宏观数据",
    title: "国家统计局：最新全国居民消费价格指数 (CPI) 运行情况保持平稳",
    summary: "全国居民消费价格（CPI）环比上涨0.1%，同比持平，核心CPI扣除食品和能源价格后运行在温和区间。",
    source: "国家统计局",
    isObjective: true
  },
  {
    id: "nb-002",
    time: "09:40",
    type: "央行公开市场",
    title: "中国人民银行开展公开市场逆回购操作维护银行体系流动性合理充裕",
    summary: "今日开展7天期逆回购操作规模200亿元，中标利率保持1.50%不变，对冲到期资金后实现资金净回笼50亿元。",
    source: "中国人民银行官网",
    isObjective: true
  },
  {
    id: "nb-003",
    time: "09:00",
    type: "交易所规则",
    title: "证券交易所进一步优化上市公司年报披露工作备忘录与指引",
    summary: "重点强化重大资产重组标的资产业绩承诺履行情况及研发投入会计处理规则的合规透明度披露。",
    source: "上海/深圳证券交易所",
    isObjective: true
  },
  {
    id: "nb-004",
    time: "08:30",
    type: "全球宏观",
    title: "全球主要央行公布最新一期基准利率决策简报",
    summary: "欧洲央行与英格兰银行发布最新通胀预期调研摘要，显示制造业采购经理人指数(PMI)呈现结构性分化。",
    source: "国际清算银行简报",
    isObjective: true
  }
];

// Check compliance violation helper
function checkComplianceViolation(input: string): { isViolation: boolean; reason: string } {
  const normalized = input.toLowerCase();
  
  // Illegal patterns: prediction, buy/sell action, specific stock recommendation, golden-cross trading signals
  const violationPatterns = [
    { regex: /(该买|该卖|能买吗|能卖吗|该不该买|推荐个股|推荐股票|推荐基金|抄底|逃顶|必涨|必跌)/i, reason: "涉及个股/基金具体的买卖操作建议或投顾行为" },
    { regex: /(突破了吗|反弹买点|这是买点吗|后市走势预测|明天会涨吗|预测.*走势|目标价)/i, reason: "涉及对未来市场价格走势的预测性判断" },
    { regex: /(金叉该买吗|死叉赶紧抛|红三兵后市大涨|k线形态预测)/i, reason: "将K线/技术指标形态解读为直接买卖信号" },
    { regex: /(帮我选一只|配置.*比例的股票|哪只重仓好)/i, reason: "涉及特定资产配置比例建议或具体证券投资咨询" }
  ];

  for (const pattern of violationPatterns) {
    if (pattern.regex.test(normalized)) {
      return { isViolation: true, reason: pattern.reason };
    }
  }

  return { isViolation: false, reason: "" };
}

// Route: API Health
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", service: "FinTranslate API", complianceGuard: "Active" });
});

// Route: Get real-time objective bulletins
app.get("/api/bulletins", (req: Request, res: Response) => {
  res.json({
    success: true,
    bulletins: FINANCIAL_BULLETINS,
    disclaimer: "本快讯播报仅汇总客观公开统计数据与监管规则事实，不包含任何投资分析、买卖推荐或走势推测。"
  });
});

// Route: Translate financial term or selected text
app.post("/api/translate", async (req: Request, res: Response) => {
  try {
    const { text, context, mode } = req.body;
    if (!text || typeof text !== "string") {
      res.status(400).json({ error: "Text is required" });
      return;
    }

    const trimmed = text.trim();

    // 1. Silent Background Safety Check (Filters investment advice & predictions into objective concept definitions)
    const complianceCheck = checkComplianceViolation(trimmed);
    if (complianceCheck.isViolation) {
      res.json({
        success: true,
        isComplianceBlocked: false,
        term: trimmed,
        plainText: `该问题涉及市场具体买卖决策或后市预测。从量化与财务客观逻辑来看，各类指标反映的均是历史成交与财务数据的统计特征，并不代表确定性未来涨跌。建议结合具体标的基本面与自身风险承受能力理性评估。`,
        formalDefinition: "金融市场价格波动受宏观流动性、公司内生价值等多重随机变量驱动，技术形态属于历史统计规律。",
        formula: ""
      });
      return;
    }

    // 2. Check if text matches built-in dictionary
    const lower = trimmed.toLowerCase();
    for (const [key, value] of Object.entries(DEFAULT_TERMS)) {
      if (lower.includes(key) || key.includes(lower)) {
        res.json({
          success: true,
          isComplianceBlocked: false,
          term: value.term,
          category: value.category,
          plainText: value.plainText,
          formalDefinition: value.formalDefinition,
          formula: value.formula
        });
        return;
      }
    }

    // 3. If Gemini is available, generate an objective, plain-language translation
    const ai = getAiClient();
    if (ai) {
      const prompt = `你是一个严肃、中立、不带有任何投资立场的"金融信息翻译层"。
用户选中的文本或询问的内容是：
"""${trimmed}"""
上下文信息（如有）：${context || "无"}

【必须严格执行的红线原则】：
1. 你的定位是"金融术语与信息的翻译器"，绝对不是"投资顾问"或"行情解读器"。
2. 严禁提供任何买卖建议、进出场时机、抄底逃顶提示或具体金融产品推荐。
3. 如果是K线或技术指标（如均线、MACD、布林带），只解释：
   - 这个柱子/指标由哪些数学数据构成（开高低收、加权平均等）
   - 它的数学公式是什么
   - 严禁说"这是突破形态"、"预示见底"、"金叉该买"、"后市看涨"等任何预测性话语。
4. 如果是理财/费率/财报术语，用最通俗易懂的大白话拆解，指出一般投资者容易忽略的数学常识（如年化计提、资金占用等）。

请以 JSON 格式输出，不要包含 markdown 标记之外的多余文本，字段要求：
{
  "term": "标准规范的金融术语名",
  "plainText": "用大白话解释，形象比喻，无投资买卖偏向",
  "formalDefinition": "专业、客观的金融或法律定义（1-2句话）",
  "formula": "相关的数学计算逻辑或公式（如适用，否则填空字符串）",
  "safetyBoundary": "明确的合规提示说明（强调仅供理解概念，不作为投资决策依据）"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.1, // High determinism & strict objectivity
        }
      });

      const responseText = response.text;
      if (responseText) {
        try {
          const parsed = JSON.parse(responseText);
          res.json({
            success: true,
            isComplianceBlocked: false,
            term: parsed.term || trimmed,
            plainText: parsed.plainText || "暂未找到解释",
            formalDefinition: parsed.formalDefinition || "",
            formula: parsed.formula || "",
            safetyBoundary: parsed.safetyBoundary || ""
          });
          return;
        } catch (e) {
          console.error("JSON parse error:", e);
        }
      }
    }

    // 4. Default fallback explanation
    res.json({
      success: true,
      isComplianceBlocked: false,
      term: trimmed,
      plainText: `"${trimmed}" 是一个常见的金融专业词汇。easyFinance 将其还原为客观事实与规范定义，帮助消除专业术语壁垒。`,
      formalDefinition: "该术语用于金融市场信息披露、产品合同或日常财务分析中。",
      formula: ""
    });
  } catch (error) {
    console.error("Translate error:", error);
    res.status(500).json({ error: "Translation service error" });
  }
});

// API: Conversational Chat with Screen Context
app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const { messages, screenContext, screenImage, apiKey: userApiKey, language = "zh", mode = "plain" } = req.body;
    const headerKey = req.headers["x-gemini-api-key"] as string | undefined;
    const activeApiKey = (typeof userApiKey === "string" && userApiKey.trim()) || headerKey;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "Messages array is required" });
      return;
    }

    const latestMessage = messages[messages.length - 1].text || "";
    const trimmed = latestMessage.trim();

    // 1. Silent boundary check
    const complianceCheck = checkComplianceViolation(trimmed);
    if (complianceCheck.isViolation) {
      const violationReply = language === "en"
        ? "From a quantitative and objective financial perspective, market indicators and technical charts solely reflect statistical attributes of historical transaction data and financial statements. Future asset prices are influenced by multiple variables including macro liquidity and intrinsic fundamentals, without deterministic trajectory. It is advisable to focus on fundamentals, balance sheet health, and individual risk tolerance. If you have specific terms, formulas, or financial indicators to deconstruct, I would be glad to analyze them objectively."
        : "从量化与财务客观逻辑来看，各类指标与盘面形态反映的均是历史交易数据或财务信息的统计特征，未来价格受宏观流动性、内生价值等多元变量影响，不存在确定性涨跌规律。建议关注标的基本面、财务健康度与自身风险承受能力。您如果有具体的术语、公式或财务指标需要拆解，我可以为您逐一分析。";
      res.json({
        success: true,
        reply: violationReply
      });
      return;
    }

    const ai = getAiClient(activeApiKey);
    if (ai) {
      const modeInstructionZh = mode === "professional"
        ? `【当前响应模式：专业金融逻辑分析】
目标定位：面向专业研究员与严肃财务分析者，提供严谨深入的数理逻辑与制度剖析。
1. 深入数理逻辑、金融工程原理、会计准则（如企业会计准则 CAS / IFRS）与披露口径。
2. 明确给出精准的数学公式推导、变量符号定义、时间序列与统计分布特征。
3. 剖析底层结构，对比指标口径差异（如资产负债表勾稽关系、EBITDA 与经营净现金流、单利与 IRR 内含报酬率推演、SMA 与 EMA 指数平滑）。
4. 语言严密、学术规范、逻辑自洽，直击底层金融机理。`
        : `【当前响应模式：白话通俗解释】
目标定位：充当最接地气的"金融翻译官"，用大白话彻底还原复杂的金融、会计概念。
1. 剥离生涩黑话，用生活化的大白话比喻和直观常识，把复杂的金融与合同概念讲透。
2. 凡涉及计提、费率或公式，直接用最直观的具体小例子（如"假设借1万元，每月实扣..."、"投1000块钱每天扣几分钱"）帮助理解。
3. 语言简明轻快、重点突出，段落短小直接，严禁长篇大论或晦涩说教。`;

      const modeInstructionEn = mode === "professional"
        ? `[Current Response Mode: Professional Financial Logic Analysis]
Target: Rigorous academic and professional deconstruction for financial analysts.
1. Provide rigorous mathematical logic, financial engineering mechanisms, accounting standards (GAAP/IFRS), and regulatory disclosure baselines.
2. Formulate explicit mathematical equations, variable definitions, and quantitative statistical attributes.
3. Analyze balance sheet articulations, cash flow discrepancies, and compounding yields (e.g., Simple Interest vs IRR, EBITDA vs CFO, SMA vs EMA).
4. Maintain academic precision, structured reasoning, and high information density.`
        : `[Current Response Mode: Plain Language Explanation]
Target: An approachable plain-language financial translator for everyday users.
1. Demystify complex jargon using relatable real-life analogies and intuitive common-sense concepts.
2. When explaining fees, percentages, or formulas, provide quick concrete numerical examples (e.g., "If you invest $1,000, it costs...").
3. Keep formatting clean, concise, punchy, and jargon-free without lecturing.`;

      const systemInstruction = language === "en" 
        ? `You are easyFinance, a minimalist, objective financial intelligence floating assistant.
Core mission: Serve as an objective "translation layer" and educational guide for financial and market disclosures.
${modeInstructionEn}
【Strict Operational Boundaries (enforced quietly in backend, no lecturing tone)】:
1. Adhere strictly to "explain facts, never make investment judgments".
2. Never provide buy/sell advice, portfolio allocation suggestions, or timing recommendations for stocks, funds, or crypto.
3. Never forecast future prices or provide deterministic bullish/bearish predictions.
4. When explaining technical indicators (candlesticks, moving averages, MACD, etc.), explain only their geometric components (Open, High, Low, Close), mathematical logic (exponential smoothing, divergence, mean), and historical statistical properties. Never claim a golden cross or breakout guarantees upward movement.
5. When screen content (financial statements, fund expense ratios, loan interest terms, disclosures) is provided, identify accounting formulas, fee deduction rules, compounding logic, and annualized true costs (IRR).
6. Respond in clear, concise, polished English with clean formatting.`
        : `你是 easyFinance 的极简金融智能悬浮助手。
核心定位：打造金融信息的"翻译层"与客观知识解析助手。
${modeInstructionZh}
【必须严格遵循的边界底线（仅在后台逻辑生效，前台不发表说教声明）】：
1. 恪守"只做解释，不做判断"。
2. 严禁提供任何买卖股票/基金、加减仓、抄底逃顶的投资建议与倾向性指导。
3. 严禁预测未来走势或给出涨跌确定性结论。
4. 用户询问K线、均线、MACD或技术指标时，只从几何构成（开高低收四要素）、数学计算逻辑（移动平均、差离平滑）和历史统计特征角度进行客观科普，绝对不说"突破买入"、"金叉必涨"等任何诱导性预测。
5. 当用户提供屏幕内容（财报附注、基金费率、借贷年化、公告、研报数据）时，精准识别其中的金融术语、会计口径、数学公式与计提逻辑，指出实际资金成本与定义细节。
6. 保持精炼、优雅、客观、清晰的回答风格，排版整洁，直击要害。`;

      // Build conversation history for contents
      const conversationHistory = messages.map((m: any) => ({
        role: m.role === "assistant" || m.role === "model" ? "model" : "user",
        parts: [{ text: m.text }]
      }));

      // Add screen context to the latest user message prompt
      let augmentedLatestText = trimmed;
      if (screenContext) {
        augmentedLatestText = language === "en"
          ? `【User's Current Screen Content】:\n"""\n${screenContext}\n"""\n\n【User's Question】:\n${trimmed}`
          : `【用户当前屏幕提取内容】：\n"""\n${screenContext}\n"""\n\n【用户提问】：\n${trimmed}`;
      }

      // Replace the last item with augmented text
      conversationHistory[conversationHistory.length - 1] = {
        role: "user",
        parts: [{ text: augmentedLatestText }]
      };

      // If screen snip image exists (base64)
      if (screenImage && typeof screenImage === "string") {
        const cleanBase64 = screenImage.replace(/^data:image\/[a-z]+;base64,/, "");
        (conversationHistory[conversationHistory.length - 1].parts as any).push({
          inlineData: {
            mimeType: "image/jpeg",
            data: cleanBase64
          }
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: conversationHistory,
        config: {
          systemInstruction,
          temperature: mode === "professional" ? 0.1 : 0.25
        }
      });

      const reply = response.text || (language === "en" 
        ? "Inquiry processed. Which specific metric or formula would you like to explore?"
        : "已处理完成。请问还有哪些指标或计算细节需要拆解？");
      res.json({ success: true, reply });
      return;
    }

    // Fallback response if AI is not configured
    let fallbackReply = "";
    if (mode === "professional") {
      fallbackReply = language === "en"
        ? `[Professional Logic Analysis] Regarding "${trimmed}": Focus on quantitative accrual rules, GAAP/IFRS disclosure baselines, and discounted cash flow mechanics.`
        : `【专业金融逻辑分析】关于 "${trimmed}"：核心在于厘清会计准则（CAS/IFRS）计提口径、现金流折现与时间价值。`;
    } else {
      fallbackReply = language === "en"
        ? `[Plain Explanation] Regarding "${trimmed}": In simple terms, strip away the financial marketing jargon and look at what the numbers actually cost you in practice.`
        : `【白话通俗解释】关于 "${trimmed}"：简单来说，就是看穿各种高大上的专业词汇，算清每一分钱真实的扣除与支出。`;
    }

    if (screenContext) {
      fallbackReply += language === "en"
        ? `\nScreen Context: Examine accrual base, compounding frequency (APR vs IRR), and cash flow timing.`
        : `\n屏幕参考：重点看准计提基数、计息周期（单利 vs IRR）及实际支付节奏。`;
    }
    res.json({ success: true, reply: fallbackReply });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Chat service error" });
  }
});

// Start Server with Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FinTranslate Server running on port ${PORT}`);
  });
}

startServer();

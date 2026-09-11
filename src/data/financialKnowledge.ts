import { FinancialBulletin, DemoArticle, ExtensionFileSnippet, DictionaryItem } from '../types';

export const SAMPLE_BULLETINS: FinancialBulletin[] = [
  {
    id: 'nb-1',
    time: '10:30',
    type: '宏观数据',
    typeEn: 'Macro Data',
    title: '统计局发布居民消费价格统计报告：核心CPI保持平稳',
    titleEn: 'National Bureau of Statistics Releases CPI Report: Core CPI Remains Resilient',
    summary: '全国居民消费价格（CPI）环比上涨0.1%，同比持平。扣除食品和能源价格的核心CPI同比上涨0.5%，物价总水平保持温和态势。',
    summaryEn: 'National Consumer Price Index (CPI) gained 0.1% MoM, unchanged YoY. Core CPI (ex food & energy) rose 0.5% YoY, maintaining moderate price trajectory.',
    source: '国家统计局官网',
    sourceEn: 'National Bureau of Statistics',
    isObjective: true
  },
  {
    id: 'nb-2',
    time: '09:45',
    type: '央行公开市场',
    typeEn: 'Central Bank Operations',
    title: '人民银行今日开展230亿元7天期逆回购操作，中标利率1.50%',
    titleEn: 'Central Bank Conducts 23B Yuan 7-day Reverse Repo at 1.50% Rate',
    summary: '为维护银行体系流动性合理充裕，央行以固定利率、数量招标方式开展公开市场业务，今日有180亿元逆回购到期，实现净投放50亿元。',
    summaryEn: 'To maintain sufficient liquidity in the banking system, PBOC executed fixed-rate reverse repo operations, delivering net liquidity injection of 5B Yuan.',
    source: '中国人民银行',
    sourceEn: 'People Bank of China',
    isObjective: true
  },
  {
    id: 'nb-3',
    time: '09:15',
    type: '交易所规则',
    typeEn: 'Exchange Regulations',
    title: '证券交易所发布上市公司研发投入会计处理及披露监管指南',
    titleEn: 'Stock Exchange Publishes Accounting & Disclosure Guidelines for R&D Expenses',
    summary: '明确研究阶段与开发阶段支出资本化的界定条件，要求上市公司在年报中细化披露专利转化效率，严禁模糊研发统计口径。',
    summaryEn: 'Clarifies conditions for capitalization vs expensing of R&D disbursements, requiring granular disclosure of patent monetization and strict statistical baselines.',
    source: '证券交易所业务指南',
    sourceEn: 'Stock Exchange Regulatory Guidance',
    isObjective: true
  },
  {
    id: 'nb-4',
    time: '08:40',
    type: '全球宏观',
    typeEn: 'Global Trade',
    title: '海关总署更新前8个月我国货物贸易进出口统计简报',
    titleEn: 'Customs Releases Trade Statistics Briefing for Jan-August',
    summary: '我国货物贸易进出口总值同比增长6.0%，其中机电产品出口占比近六成，高新技术绿色低碳产品保持两位数平稳增长。',
    summaryEn: 'Total goods imports and exports advanced 6.0% YoY, with mechanical and electrical goods accounting for nearly 60% of total export volume.',
    source: '海关总署',
    sourceEn: 'General Administration of Customs',
    isObjective: true
  }
];

export const DEMO_ARTICLES: DemoArticle[] = [
  {
    id: 'fund-fee',
    title: '某沪深300增强型指数证券投资基金招募说明书（节选）',
    category: '基金费率与条款',
    source: '基金公开信息披露平台',
    highlightedTerms: ['管理费', '托管费', '销售服务费', '巨额赎回', '赎回费'],
    content: `【基金费用与税收说明】
本基金财产中计提的费用包括基金管理人的管理费、基金托管人的托管费以及C类份额的销售服务费。
1. 本基金的管理费按前一日基金资产净值的0.80%年费率计提。每日计提，按月支付。
2. 托管费按前一日基金资产净值的0.15%年费率计提。
3. 针对C类基金份额，加收0.25%的销售服务费，不收取前端认购费。
4. 投资者应注意，每日公布的基金份额净值已扣除上述管理费、托管费与销售服务费。
5. 当单个开放日内，本基金净赎回申请份额超过前一日基金总份额的10%时，即构成巨额赎回，基金管理人有权启动部分延期赎回或暂停接受赎回申请机制。持有期限少于7日的投资者将触发惩罚性赎回费（1.50%并全额计入基金财产）。`
  },
  {
    id: 'kline-macd',
    title: '证券分析终端指标说明文档：K线构成与MACD计算原理',
    category: '技术指标与图表',
    source: '行情终端技术参考手册',
    highlightedTerms: ['K线', '移动平均线', 'MACD', '实体与影线', '成交量'],
    content: `【行情走势图图例与算法释义】
1. 蜡烛图（K线）：每个交易周期由四个价格参数构成——开盘价(Open)、最高价(High)、最低价(Low)与收盘价(Close)。若收盘价高于开盘价绘制为阳线，反之绘制为阴线。实体上下伸出的线条为实体与影线，记录日内极值区间。
2. 移动平均线（MA）：MA(N)为过去N个连续周期的收盘价算术平均值，平滑日度波动噪点。
3. 平滑异同移动平均线（MACD）：基于指数平滑均线（EMA12与EMA26）的差离值（DIF）构建，再通过DIF的9日EMA平滑计算信号线（DEA）。柱状线呈现两者差值（2 × (DIF - DEA)）。
【声明】：本说明仅阐述指标数学计算方法，所有几何交叉（如均线交叉、MACD零轴穿越）均为数学指标相对位移，不代表走势预测，亦不构成任何交易指示。`
  },
  {
    id: 'financial-math',
    title: '普惠金融知识问答：真实年化利率与房贷还款常识',
    category: '个人日常财务与数学',
    source: '金融消费者权益保护宣传月材料',
    highlightedTerms: ['年化利率', '等额本息', '等额本金', '提前还贷', '复利'],
    content: `【借贷与理财数学常识】
1. 很多分期平台宣传“月息五厘”或“分期手续费每月0.5%”，消费者常误将年利率计算为0.5% × 12 = 6%。但在分期还款中，借款人每个月都在归还本金，手中占用的本金每个月都在递减，实际年化利率（IRR计算口径）实际上接近11%~12%。
2. 在个人房贷还款方案中，等额本息的特点是每月总还款额固定，前期月供中利息占比极高、本金极少；等额本金则是每月归还的本金固定，利息随本金减少逐月递减，前期还款额大、后期逐渐减轻。
3. 提前还贷是否合算，取决于居民家庭当前的现金流动性储备、投资机会成本与心理负债容忍度，并不存在适用于所有人的统一公式。`
  },
  {
    id: 'corp-report',
    title: '某科技制造业上市公司年度财务报告附注摘要',
    category: '财报专业术语',
    source: '巨潮资讯网上市公司年报',
    highlightedTerms: ['商誉减值', '研发费用资本化', '资产负债率', '经营性现金流'],
    content: `【重要会计政策及会计估计说明】
1. 商誉减值准备：本公司在资产负债表日对因非同一控制下企业合并形成的商誉进行减值测试。当资产组的可收回金额低于其账面价值时，确认相应的商誉减值损失。该损失一经确认，在以后会计期间不得转回。
2. 研发费用资本化：研究阶段的支出于发生时计入当期损益；开发阶段支出只有在同时满足技术可行性、商业用途意图及可靠计量等五项严格准则时，才予以资本化确认为无形资产。
3. 经营性现金流与资产负债率反映了企业的内生造血能力与偿债承压水平。`
  }
];

export const FINANCIAL_DICTIONARY: DictionaryItem[] = [
  {
    term: "MACD",
    termEn: "MACD (Moving Average Convergence Divergence)",
    category: "技术分析",
    categoryEn: "Technical Analysis",
    definition: "平滑异同移动平均线，利用短期（常用12日）和长期（常用26日）指数移动平均线之间的聚合与分离状况，观察价格动能的技术指标。",
    definitionEn: "A trend-following momentum indicator showing the relationship between two exponential moving averages (typically 12 and 26 periods) of an asset's price.",
    formula: "DIF = EMA(12) - EMA(26); DEA = EMA(DIF, 9); MACD = 2 × (DIF - DEA)"
  },
  {
    term: "K线实体",
    termEn: "Candlestick Real Body",
    category: "技术分析",
    categoryEn: "Technical Analysis",
    definition: "K线图中开盘价与收盘价之间的矩形部分。收盘价高于开盘价为阳线，反之为阴线。实体越长表明该方向动能越强。",
    definitionEn: "The central rectangular portion of a candlestick measuring the price range between the open and close. Indicates directional trading strength."
  },
  {
    term: "移动平均线 (MA)",
    termEn: "Moving Average (MA)",
    category: "技术分析",
    categoryEn: "Technical Analysis",
    definition: "将一定时期内的证券价格加以平均，并把不同时间的平均值连接起来，形成一根连续均线，用以观察中短期持仓成本中枢。",
    definitionEn: "A calculation used to analyze data points by creating a series of averages of different subsets of the full data set to smooth out short-term price fluctuations.",
    formula: "MA(N) = (C1 + C2 + ... + Cn) / N"
  },
  {
    term: "公募管理费",
    termEn: "Mutual Fund Management Fee",
    category: "基金术语",
    categoryEn: "Fund Terms",
    definition: "基金管理人为管理和操作基金而收取的报酬，按基金资产净值每日计提，按月扣除，净值已扣减此项费用。",
    definitionEn: "A periodic payment paid by an investment fund to its investment adviser for managing the fund, accrued daily against net asset value.",
    formula: "Daily Accrual = Previous Day NAV × Annual Fee Rate ÷ 365"
  },
  {
    term: "等额本息",
    termEn: "Equal Principal & Interest (Annuity Loan)",
    category: "贷款常识",
    categoryEn: "Loan & Credit",
    definition: "还款期内每月偿还同等数额的本息总额。前期月供中利息占比大、本金较小，后期本金占比逐步增加。",
    definitionEn: "A loan repayment structure where the total monthly installment remains constant; interest dominates early payments, while principal reduction increases over time."
  },
  {
    term: "等额本金",
    termEn: "Equal Principal Repayment",
    category: "贷款常识",
    categoryEn: "Loan & Credit",
    definition: "还款期内每月偿还固定本金，利息随剩余本金递减，每月总还款额逐月下降，总利息支出低于等额本息。",
    definitionEn: "A loan amortization method where fixed principal is repaid monthly while interest diminishes as outstanding balance decreases."
  },
  {
    term: "商誉减值",
    termEn: "Goodwill Impairment",
    category: "财务报表",
    categoryEn: "Financial Statements",
    definition: "并购形成的商誉，当被收购资产未来可收回金额低于账面价值时，必须计提减值损失，直接冲减当期净利润且不可转回。",
    definitionEn: "An accounting charge when the carrying value of goodwill on the balance sheet exceeds its fair market value, directly reducing net income."
  },
  {
    term: "市净率 (PB)",
    termEn: "Price-to-Book Ratio (P/B)",
    category: "财务报表",
    categoryEn: "Financial Statements",
    definition: "每股股价与每股净资产的比率。反映市场对企业净资产所给予的估值倍数。",
    definitionEn: "A financial metric that compares a company's current market value to its book value, evaluating whether an asset is priced above or below tangible assets.",
    formula: "PB = Market Price per Share ÷ Book Value per Share"
  },
  {
    term: "内部收益率 (IRR)",
    termEn: "Internal Rate of Return (IRR)",
    category: "贷款常识",
    categoryEn: "Loan & Credit",
    definition: "使资金流入净现值与流出净现值相等的实际折现率，常用于揭示分期消费、保险理财中真实资金年化成本。",
    definitionEn: "The discount rate that makes the net present value (NPV) of all cash flows from a particular project or loan installment equal to zero."
  },
  {
    term: "市盈率 (PE)",
    termEn: "Price-to-Earnings Ratio (P/E)",
    category: "财务报表",
    categoryEn: "Financial Statements",
    definition: "每股股票价格除以每股盈利的比率，反映投资者为企业每单位净利润所支付的价格倍数。",
    definitionEn: "The ratio for valuing a company that measures its current share price relative to its earnings per share (EPS).",
    formula: "PE = Market Price per Share ÷ Earnings per Share (EPS)"
  }
];

export const EXTENSION_SKELETON_FILES: ExtensionFileSnippet[] = [
  {
    name: 'manifest.json',
    language: 'json',
    description: 'Chrome Extension MV3 配置文件：严格最小权限声明与内容脚本配置',
    code: `{
  "manifest_version": 3,
  "name": "easyFinance",
  "version": "1.0.0",
  "description": "极简金融术语悬浮翻译与实时客观资讯播报助手",
  "permissions": [
    "storage",
    "alarms"
  ],
  "action": {
    "default_popup": "popup.html",
    "default_icon": "icons/icon-32.png"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"],
      "run_at": "document_end"
    }
  ],
  "background": {
    "service_worker": "background.js"
  }
}`
  },
  {
    name: 'content.js',
    language: 'javascript',
    description: '内容脚本：Shadow DOM 隔离悬浮球与划词浮窗，避免污染宿主页面样式',
    code: `// content.js - 注入页面并采用 Shadow DOM 隔离
(function() {
  if (window.__easy_finance_injected) return;
  window.__easy_finance_injected = true;

  // 1. 创建隔离容器
  const host = document.createElement('div');
  host.id = 'easy-finance-host';
  const shadow = host.attachShadow({ mode: 'open' });
  document.body.appendChild(host);

  // 2. 注入极简悬浮球与划词浮窗
  const widgetContainer = document.createElement('div');
  widgetContainer.innerHTML = \`
    <style>
      .ef-ball {
        position: fixed; right: 24px; bottom: 80px; width: 44px; height: 44px;
        border-radius: 50%; background: #090d16; color: #38bdf8;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 4px 16px rgba(0,0,0,0.3); cursor: grab; z-index: 999999;
        font-family: system-ui, -apple-system, sans-serif; font-size: 13px; font-weight: 700;
        border: 1px solid #1e293b; transition: transform 0.2s ease;
      }
      .ef-ball:hover { transform: scale(1.05); }
      .ef-popover {
        position: fixed; display: none; width: 340px; background: #0f172a;
        border: 1px solid #334155; border-radius: 16px; box-shadow: 0 12px 32px rgba(0,0,0,0.4);
        padding: 16px; font-family: system-ui, -apple-system, sans-serif; z-index: 9999999;
        color: #f8fafc;
      }
      .ef-term { font-weight: 700; font-size: 15px; margin: 0 0 8px 0; color: #ffffff; }
      .ef-text { font-size: 13px; color: #cbd5e1; line-height: 1.6; }
      .ef-formula { margin-top: 8px; font-family: monospace; font-size: 11px; background: #020617; padding: 6px 8px; border-radius: 6px; color: #38bdf8; }
    </style>
    <div id="ef-floating-ball" class="ef-ball" title="easyFinance">eF</div>
    <div id="ef-popover-card" class="ef-popover">
      <div id="ef-term-title" class="ef-term"></div>
      <div id="ef-plain-text" class="ef-text"></div>
      <div id="ef-formula-box" class="ef-formula" style="display:none;"></div>
    </div>
  \`;
  shadow.appendChild(widgetContainer);

  // 3. 监听网页划词选中文本
  document.addEventListener('mouseup', () => {
    const selection = window.getSelection().toString().trim();
    if (selection.length > 1 && selection.length < 50) {
      chrome.runtime.sendMessage({ type: 'TRANSLATE_TERM', term: selection }, (res) => {
        if (res && res.data) {
          showPopover(res.data);
        }
      });
    }
  });

  function showPopover(data) {
    const pop = shadow.getElementById('ef-popover-card');
    shadow.getElementById('ef-term-title').innerText = data.term;
    shadow.getElementById('ef-plain-text').innerText = data.plainText;
    const formulaBox = shadow.getElementById('ef-formula-box');
    if (data.formula) {
      formulaBox.innerText = data.formula;
      formulaBox.style.display = 'block';
    } else {
      formulaBox.style.display = 'none';
    }
    pop.style.display = 'block';
  }
})();`
  },
  {
    name: 'background.js',
    language: 'javascript',
    description: '后台 Service Worker：静默安全中立处理与词库查询',
    code: `// background.js - MV3 核心服务进程
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TRANSLATE_TERM') {
    const term = message.term;

    // 发起后端或内置词库查询
    fetch('https://api.example.com/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: term })
    })
    .then(r => r.json())
    .then(data => sendResponse({ data }))
    .catch(err => sendResponse({ error: err.message }));

    return true; // 异步响应
  }
});`
  }
];

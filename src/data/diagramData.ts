import { DiagramFlow } from '../types';

export const FINANCIAL_DIAGRAMS: DiagramFlow[] = [
  {
    id: 'fund-fee-flow',
    title: '公募基金每日计提费率流转链路',
    titleEn: 'Fund Daily Fee Deduction Path',
    subtitle: '拆解净值计提背后的“每日扣除、按月支付”全链路',
    subtitleEn: 'Accrual path: daily deduction and monthly payment settlement',
    category: 'fund',
    categoryLabel: '基金费率',
    categoryLabelEn: 'Fund Fees',
    nodes: [
      {
        id: 'nav-base',
        label: '前日资产净值 (NAV)',
        labelEn: 'Prior-day NAV Base',
        desc: '前一工作日闭市后的基金资产净值（含所有持仓股票、债券公允价值总和）',
        descEn: 'Closing fund net asset value of the preceding business day',
        mathFormula: 'NAV = 基金总资产 - 基金总负债',
        plainMeaning: '昨天收盘后整个基金池子算出来的总家底，是今天扣费的绝对计算基数。',
        plainMeaningEn: 'Total fund pool size yesterday, serving as the benchmark for daily fee calculation today.',
        type: 'source',
        tag: '计算基数'
      },
      {
        id: 'daily-accrual',
        label: '每日计提运算器',
        labelEn: 'Daily Accrual Engine',
        desc: '系统于每个工作日天平对账时自动计算当天的管理费与托管费额度',
        descEn: 'Automatic daily calculation of management and custody fees',
        mathFormula: 'E = S × 年费率 ÷ 当年天数 (365天)',
        plainMeaning: '不管今天大盘涨还是跌，天天都会按比例切下一小片蛋糕。',
        plainMeaningEn: 'Regardless of market gains or losses, a fraction is deducted every single calendar day.',
        type: 'process',
        tag: '计提公式'
      },
      {
        id: 'mgmt-fee',
        label: '管理费子账户 (0.65%)',
        labelEn: 'Management Fee (0.65%)',
        desc: '计入基金当期管理费用，逐日累计至月末，次月支付给基金管理人',
        descEn: 'Remitted monthly to fund manager for operations & research',
        mathFormula: '管理费 = S × 0.65% ÷ 365',
        plainMeaning: '给基金经理团队和基金公司的服务费，按天扣除但按月统一划转。',
        plainMeaningEn: 'Compensation to the fund management company for operational and research overhead.',
        type: 'destination',
        tag: '管理人'
      },
      {
        id: 'cust-fee',
        label: '托管费子账户 (0.10%)',
        labelEn: 'Custody Fee (0.10%)',
        desc: '计入当期托管费用，逐日累计，次月由托管银行直接划扣',
        descEn: 'Remitted to commercial bank custodian for safe asset holding',
        mathFormula: '托管费 = S × 0.10% ÷ 365',
        plainMeaning: '给银行保管钱的保管箱租赁费，保证基金经理不能私自挪用资金。',
        plainMeaningEn: 'Safe-keeping fee to the bank to ensure assets remain segregated and protected.',
        type: 'destination',
        tag: '托管行'
      },
      {
        id: 'published-nav',
        label: '当日公布的单位净值',
        labelEn: 'Published Net Asset Value',
        desc: '已完全剔除当期所有计提费用后计算得出的最终投资者净值',
        descEn: 'Final per-unit value published to investors after all deductions',
        mathFormula: '当日单位净值 = (当日资产 - 当日负债 - 当日计提费) ÷ 份额',
        plainMeaning: '你每晚在手机 App 上看到的净值，实际上已经是被扣除过当天管理费之后的净额了。',
        plainMeaningEn: 'The value displayed on trading apps has already had daily fees deducted silently.',
        type: 'metric',
        tag: '终端净值'
      }
    ],
    connections: [
      { from: 'nav-base', to: 'daily-accrual', label: '提供基数' },
      { from: 'daily-accrual', to: 'mgmt-fee', label: '计提0.65%' },
      { from: 'daily-accrual', to: 'cust-fee', label: '计提0.10%' },
      { from: 'mgmt-fee', to: 'published-nav', label: '费用抵减' },
      { from: 'cust-fee', to: 'published-nav', label: '费用抵减' }
    ],
    summaryPlain: '公募基金费率不是每年年底一次性交，而是将年化费率除以365天，每天悄悄在基金净值里扣除，手机上看到的净值已经是扣除后的价格。',
    summaryPlainEn: 'Fund management fees are not charged in a lump sum annually; they are divided by 365 and silently subtracted each day prior to unit NAV publication.',
    summaryPro: '依据《证券投资基金会计核算业务指引》，管理费与托管费按前一日基金资产净值与规定费率计提，计入基金损益，逐日累计至每月经托管人核对后划付。',
    summaryProEn: 'Management and custody fees are accrued daily based on prior-day NAV, recorded as current fund expenses, and settled monthly upon custodian reconciliation.'
  },
  {
    id: 'loan-irr-flow',
    title: '分期还款现金流与真实年化 IRR 结构',
    titleEn: 'Loan Cashflow & True Annualized IRR',
    subtitle: '对比名义分期费率与有效年利率（EAR / IRR）的本质差异',
    subtitleEn: 'Contrasting nominal installment rates with effective internal rate of return',
    category: 'loan',
    categoryLabel: '贷款年化',
    categoryLabelEn: 'True Loan IRR',
    nodes: [
      {
        id: 'nominal-total',
        label: '名义借款本金 (12,000元)',
        labelEn: 'Nominal Principal ($12,000)',
        desc: '签约初始全额本金，12期分期偿还',
        descEn: 'Initial total borrow amount amortized over 12 monthly periods',
        mathFormula: 'P_0 = 12,000 元',
        plainMeaning: '一开始拿到手里的钱，但之后每个月都要还回去一部分。',
        plainMeaningEn: 'Total borrowed cash upfront, which decreases steadily every month.',
        type: 'source',
        tag: '初始借入'
      },
      {
        id: 'monthly-repay',
        label: '每期固定还款额 (1,050元)',
        labelEn: 'Monthly Installment ($1,050)',
        desc: '每期固定扣款：本金 1,000 元 + 名义手续费 50 元 (0.416%)',
        descEn: 'Fixed monthly outflow: $1,000 principal + $50 nominal fee',
        mathFormula: 'C_t = P_0/12 + P_0 × 0.416% = 1,050 元',
        plainMeaning: '每个月雷打不动还同样多的钱，看起来手续费只有区区50块。',
        plainMeaningEn: 'Fixed payment made every month, creating an illusion of a tiny fee.',
        type: 'process',
        tag: '现金流出'
      },
      {
        id: 'declining-principal',
        label: '本金实际占用余额递减',
        labelEn: 'Declining Principal Balance',
        desc: '第1个月占用12000，但第6个月仅占用6000，第12个月仅占用1000',
        descEn: 'Average principal in use is roughly half of original principal',
        mathFormula: 'P_t = P_0 - (t-1) × 1,000',
        plainMeaning: '到第12个月时你只借了银行1000块钱，但银行依旧按12000全额收你50块手续费！',
        plainMeaningEn: 'In month 12 you only hold $1,000, yet fees are still billed against full $12,000!',
        type: 'risk',
        tag: '核心陷阱'
      },
      {
        id: 'irr-discounting',
        label: '净现值方程 (NPV=0) 折现求解',
        labelEn: 'IRR Net Present Value Equation',
        desc: '令借入现金流入与所有月度流出的现值之和精确归零',
        descEn: 'Solving internal rate where PV of inflows matches PV of outflows',
        mathFormula: '12000 = ∑ [ 1050 ÷ (1 + r)^t ] (t=1..12)',
        plainMeaning: '考虑资金的时间价值，算清借给你的平均时间到底有多长。',
        plainMeaningEn: 'Factoring in time value of money and actual duration of funds utilized.',
        type: 'process',
        tag: '数学求解'
      },
      {
        id: 'true-irr-result',
        label: '真实有效年化利率 (IRR: ~9.2%)',
        labelEn: 'True Effective APR (IRR: ~9.2%)',
        desc: '几乎是名义年化费率 (5.0%) 的接近两倍',
        descEn: 'Nearly double the quoted nominal fee rate (5.0%)',
        mathFormula: 'IRR ≈ 名义费率 × 1.85 ~ 1.95',
        plainMeaning: '所谓“每月只要0.5%费率”，折算成年化借款真实利息直接接近10%！',
        plainMeaningEn: 'Advertised 0.5% monthly fee translates to nearly 10% true annualized borrowing cost.',
        type: 'metric',
        tag: '真实代价'
      }
    ],
    connections: [
      { from: 'nominal-total', to: 'monthly-repay', label: '分摊12期' },
      { from: 'monthly-repay', to: 'declining-principal', label: '本金归还' },
      { from: 'declining-principal', to: 'irr-discounting', label: '余额减半' },
      { from: 'irr-discounting', to: 'true-irr-result', label: '折现求得' }
    ],
    summaryPlain: '等额本息或分期付款时，借款本金每月都在减少，但手续费却始终按最初总额收。因此真实年化利息（IRR）通常是名义费率的 1.85 到 2 倍。',
    summaryPlainEn: 'Because borrowed principal diminishes every month while installment fees remain pegged to initial principal, true IRR is typically 1.85x to 2x the advertised rate.',
    summaryPro: '分期还款资金占用加权平均期为总期数的一半左右。内部收益率（IRR）基于折现现金流法求解净现值为零的贴现率，是衡量真实资金成本的法定客观口径。',
    summaryProEn: 'Amortization halves effective duration. Internal Rate of Return (IRR) determines discount rate where NPV equals zero, serving as the regulatory benchmark for true financing cost.'
  },
  {
    id: 'dupont-analysis-tree',
    title: '杜邦分析核心三因子拆解树',
    titleEn: 'DuPont ROE Analysis Decomposition Tree',
    subtitle: '将净资产收益率（ROE）拆解为盈利、周转与杠杆三大支柱',
    subtitleEn: 'Deconstructing ROE into profit margin, asset turnover, and financial leverage',
    category: 'analysis',
    categoryLabel: '杜邦分析',
    categoryLabelEn: 'DuPont Tree',
    nodes: [
      {
        id: 'roe-root',
        label: '净资产收益率 (ROE)',
        labelEn: 'Return on Equity (ROE)',
        desc: '衡量股东投入单位净资产所获得的最终净利润产出能力',
        descEn: 'Ultimate metric measuring return generated per dollar of equity',
        mathFormula: 'ROE = 净利润 ÷ 股东权益',
        plainMeaning: '股东投给公司100块钱，一年下来能净赚多少块钱。巴菲特最看重的综合指标。',
        plainMeaningEn: 'How many dollars of profit are generated per $100 of net shareholder investment.',
        type: 'metric',
        tag: '终极指标'
      },
      {
        id: 'net-profit-margin',
        label: '销售净利润率 (盈利能力)',
        labelEn: 'Net Profit Margin (Profitability)',
        desc: '每一元营业收入中扣除全部成本、税费后剩下的纯利润比例',
        descEn: 'Percentage of revenue remaining after all costs, expenses, and taxes',
        mathFormula: '净利润率 = 净利润 ÷ 营业收入',
        plainMeaning: '做生意东西卖得贵不贵，有没有护城河暴利（如茅台、苹果）。',
        plainMeaningEn: 'Pricing power and gross-to-net retention margin (e.g. Luxury, Software).',
        type: 'process',
        tag: '利润表'
      },
      {
        id: 'asset-turnover',
        label: '资产周转率 (营运能力)',
        labelEn: 'Asset Turnover (Efficiency)',
        desc: '企业总资产在一定时期内周转创造营业收入的次数',
        descEn: 'How efficiently assets are deployed to generate gross revenues',
        mathFormula: '资产周转率 = 营业收入 ÷ 平均总资产',
        plainMeaning: '货物在货架上转得快不快，薄利多销转得飞起（如商超、零售仓储）。',
        plainMeaningEn: 'Velocity of asset utilization and volume sales efficiency (e.g. Costco, Walmart).',
        type: 'process',
        tag: '综合运营'
      },
      {
        id: 'equity-multiplier',
        label: '权益乘数 (财务杠杆)',
        labelEn: 'Equity Multiplier (Financial Leverage)',
        desc: '总资产相当于股东权益的倍数，反映向银行借款加杠杆的程度',
        descEn: 'Ratio of total assets to shareholders equity, reflecting indebtedness',
        mathFormula: '权益乘数 = 总资产 ÷ 股东权益 = 1 ÷ (1 - 资产负债率)',
        plainMeaning: '自己出多少钱，借了银行多少钱。借钱越多乘数越大，赚了放大，亏了翻车。',
        plainMeaningEn: 'How heavily operations are financed through debt rather than pure equity.',
        type: 'risk',
        tag: '杠杆风险'
      }
    ],
    connections: [
      { from: 'net-profit-margin', to: 'roe-root', label: '乘积项 1' },
      { from: 'asset-turnover', to: 'roe-root', label: '乘积项 2' },
      { from: 'equity-multiplier', to: 'roe-root', label: '乘积项 3' }
    ],
    summaryPlain: 'ROE = 暴利程度（利润率） × 周转快慢（周转率） × 借钱杠杆（权益乘数）。如果一个公司ROE很高，但拆解后发现全靠借债杠杆硬撑，就存在很大爆雷风险。',
    summaryPlainEn: 'ROE = Profit Margin × Asset Turnover × Leverage Multiplier. High ROE driven solely by excessive debt leverage signals high liquidity and solvency risk.',
    summaryPro: '杜邦分析法利用恒等式将综合收益率分解为三大驱动因子，分别对应产品溢价权（损益表）、资产配置与周转效率（运营管理）和资本结构偿债风险（负债表）。',
    summaryProEn: 'DuPont identity factors ROE into profitability, operational velocity, and solvency structure, diagnosing whether quality of returns stems from pricing, execution, or debt.'
  },
  {
    id: 'kline-macd-structure',
    title: 'K线四要素几何分布与 MACD 动能结构',
    titleEn: 'Candlestick 4 Elements & MACD Dynamics',
    subtitle: '开高低收离散点到移动平滑二阶导数动量指标的数学映射',
    subtitleEn: 'Mathematical mapping from OHLC points to smoothed momentum derivatives',
    category: 'kline',
    categoryLabel: 'K线指标',
    categoryLabelEn: 'Technical OHLC',
    nodes: [
      {
        id: 'ohlc-raw',
        label: '时序四价格 (OHLC)',
        labelEn: 'Period OHLC Prices',
        desc: '开盘价(Open)、最高价(High)、最低价(Low)、收盘价(Close)',
        descEn: 'Raw boundary prices across a defined trading session',
        mathFormula: 'P_open, P_high, P_low, P_close',
        plainMeaning: '开盘集合竞价、盘中最高冲到哪、盘中最低跌到哪、最终收盘停在哪。',
        plainMeaningEn: 'Opening price, highest peak reached, lowest trough, and final closing price.',
        type: 'source',
        tag: '原始数据'
      },
      {
        id: 'candle-body',
        label: '实体与上下影线几何',
        labelEn: 'Candle Body & Shadow Spikes',
        desc: '实体长短记录多空终局强弱，影线长短记录极端位置的试探与阻力反弹',
        descEn: 'Body measures net directional conviction; shadows record extremes tested',
        mathFormula: '实体 = |Close - Open|, 上影 = High - max(O,C)',
        plainMeaning: '实体越长代表买卖双方分出胜负越干脆；长长的上影线说明冲高被狠狠砸了回来。',
        plainMeaningEn: 'Tall body indicates strong directional control; long upper shadow reflects selling resistance.',
        type: 'metric',
        tag: '价格形态'
      },
      {
        id: 'ema-smoothing',
        label: '双指数移动平均 (EMA12 / EMA26)',
        labelEn: 'Dual Exponential Moving Averages',
        desc: '对收盘价赋予越近期越高的指数衰减权重，滤除高频杂波',
        descEn: 'Applying exponential decay weighting to recent closing prices',
        mathFormula: 'EMA_t = α × Close_t + (1 - α) × EMA_{t-1}',
        plainMeaning: '离今天越近的日子权重越高，平滑算出一快一慢两条趋势平滑线。',
        plainMeaningEn: 'Weighting recent sessions exponentially higher to extract trend velocity.',
        type: 'process',
        tag: '平滑滤波'
      },
      {
        id: 'dif-fast',
        label: '离差值 (DIF = 快线 - 慢线)',
        labelEn: 'DIF Line (Fast EMA - Slow EMA)',
        desc: '12日指数均线减去26日指数均线的离差，反映价格变动的速度',
        descEn: 'Spread between 12-day and 26-day EMAs measuring trend velocity',
        mathFormula: 'DIF = EMA(12) - EMA(26)',
        plainMeaning: '快车减慢车的车距，车距拉大说明油门踩得深，车距变窄说明开始减速。',
        plainMeaningEn: 'Gap between fast and slow curves; widening gap indicates accelerating momentum.',
        type: 'metric',
        tag: 'DIF快线'
      },
      {
        id: 'macd-histogram',
        label: 'MACD 能量柱状图 (Bar)',
        labelEn: 'MACD Histogram Bars',
        desc: 'DIF 与其 9日平滑线 DEA 之间差值的两倍，反映动量的加速度变化',
        descEn: 'Twice the delta between DIF and DEA, capturing momentum acceleration',
        mathFormula: 'BAR = 2 × (DIF - DEA)',
        plainMeaning: '红绿柱从变长到变短，说明冲锋势头虽然还在，但加速度已经在减弱了。',
        plainMeaningEn: 'Shrinking histogram bars signal that momentum is weakening even before price turns.',
        type: 'destination',
        tag: '多空能量'
      }
    ],
    connections: [
      { from: 'ohlc-raw', to: 'candle-body', label: '几何渲染' },
      { from: 'ohlc-raw', to: 'ema-smoothing', label: '收盘价平滑' },
      { from: 'ema-smoothing', to: 'dif-fast', label: '快慢线相减' },
      { from: 'dif-fast', to: 'macd-histogram', label: '二次平滑求差' }
    ],
    summaryPlain: 'K线反映每一天的搏杀胜负与影线试探；MACD 则是把收盘价做两次指数均线平滑，通过快慢均线差距的柱子长短，提前看清动能是在加速还是衰竭。',
    summaryPlainEn: 'Candlesticks record discrete session battle outcomes; MACD applies exponential smoothing to spot momentum shifts and acceleration changes before price reversals occur.',
    summaryPro: 'K线是离散价格状态空间的形态切片；MACD 则利用一阶加权低通滤波与差分，度量时序价格运动的初速度与二阶加速度特征。',
    summaryProEn: 'Candlesticks map price extrema; MACD functions as a digital bandpass filter computing the spread and derivative of exponential moving averages.'
  },
  {
    id: 'three-statements-flow',
    title: '财务报表三表勾稽联动关系',
    titleEn: 'Three Financial Statements Articulation',
    subtitle: '资产负债表（存量）、利润表（流量）与现金流量表（真金白银）的内在闭环',
    subtitleEn: 'Interlocking closed loop of Balance Sheet, Income Statement, and Cash Flows',
    category: 'statements',
    categoryLabel: '财报勾稽',
    categoryLabelEn: '3-Statements',
    nodes: [
      {
        id: 'balance-sheet',
        label: '资产负债表 (存量快照)',
        labelEn: 'Balance Sheet (Stock Snapshot)',
        desc: '记录企业在某一时点全部资产、负债及所有者权益的静止全貌',
        descEn: 'Cumulative snapshot of assets, liabilities, and equity at a specific point in time',
        mathFormula: '资产 = 负债 + 所有者权益',
        plainMeaning: '给公司家底拍的一张全身定格照，手里有多少房产、借了多少银行款、股东自己出了多少。',
        plainMeaningEn: 'A static snapshot of what a company owns, owes, and residual book value.',
        type: 'source',
        tag: '时点存量'
      },
      {
        id: 'income-statement',
        label: '利润表 (经营期间流量)',
        labelEn: 'Income Statement (Period Flow)',
        desc: '记录企业在一段时间内创造的总收入、总成本及最终净利润',
        descEn: 'Measures financial performance and profitability generated over a defined accounting period',
        mathFormula: '净利润 = 营业收入 - 营业成本 - 期间费用 - 所得税',
        plainMeaning: '记录这一年到底赚了多少账面利润，注意账面利润不等于银行卡里真有这么多现金。',
        plainMeaningEn: 'Report of revenues and expenses; note that accounting profit differs from real cash in bank.',
        type: 'process',
        tag: '期间流量'
      },
      {
        id: 'cash-flow-stmt',
        label: '现金流量表 (实际现金进出)',
        labelEn: 'Cash Flow Statement (Liquidity)',
        desc: '追踪经营活动、投资活动、筹资活动的全部真金白银现金流净变动',
        descEn: 'Tracks actual cash inflows and outflows across operating, investing, and financing',
        mathFormula: '现金净变动 = 经营净额 + 投资净额 + 筹资净额',
        plainMeaning: '公司的现金血液，进账多少真金白银，支出多少真金白银，假账极难在这张表完全抹平。',
        plainMeaningEn: 'True physical cash movements; extremely resilient against aggressive accrual accounting tricks.',
        type: 'metric',
        tag: '真实流动性'
      },
      {
        id: 'retained-earnings-tie',
        label: '留存收益勾稽纽带',
        labelEn: 'Retained Earnings Articulation',
        desc: '利润表的净利润扣除分红后，滚入资产负债表“未分配利润”科目的净增量',
        descEn: 'Net income less dividends directly flows into ending retained earnings on balance sheet',
        mathFormula: '期末留存收益 = 期初留存收益 + 本期净利润 - 本期现金分红',
        plainMeaning: '利润表赚到的钱，发完分红后剩下的，原原本本存进资产负债表的净资产账户里。',
        plainMeaningEn: 'Profits left after paying dividends accumulate directly into shareholders equity on the balance sheet.',
        type: 'destination',
        tag: '利润结转'
      },
      {
        id: 'cash-tie',
        label: '货币资金期末核对',
        labelEn: 'Cash Balance Reconciliation',
        desc: '现金流量表计算出的“现金及现金等价物净增加额”必须分文不差等于资产负债表“货币资金”变动',
        descEn: 'Net cash change from cash flow statement must match delta in balance sheet cash line item',
        mathFormula: '资产负债表Δ货币资金 ≡ 现金流量表期末现金变动',
        plainMeaning: '现金流表算出来的口袋净进账，必须和负债表银行存款账面的变化分厘不差完全吻合。',
        plainMeaningEn: 'Ending cash on cash flow statement must mathematically reconcile with cash on balance sheet.',
        type: 'destination',
        tag: '铁律核验'
      }
    ],
    connections: [
      { from: 'income-statement', to: 'retained-earnings-tie', label: '扣除分红' },
      { from: 'retained-earnings-tie', to: 'balance-sheet', label: '并入股东权益' },
      { from: 'cash-flow-stmt', to: 'cash-tie', label: '现金净增量' },
      { from: 'cash-tie', to: 'balance-sheet', label: '对应货币资金' }
    ],
    summaryPlain: '资产负债表是“家底照片”，利润表是“挣钱流水”，现金流量表是“口袋真钱”。利润表赚的钱滚入负债表变多，现金流表的进出精确核对银行存款，三者严丝合缝。',
    summaryPlainEn: 'Balance sheet is financial snapshot; income statement tracks accounting earnings; cash flow statement tracks cold hard cash. Retained earnings and ending cash tie them into an unbreakable unit.',
    summaryPro: '三表通过复式记账法形成严谨封闭系统：净利润调整分红后归入所有者权益留存收益；现金流量净额与资产负债表货币资金余额直接勾稽，经营现金流与营运资金变动互为因果。',
    summaryProEn: 'The three statements articulate through double-entry accounting: net income less distributions feeds retained earnings; net cash flow equates precisely to cash balance differences on balance sheet.'
  },
  {
    id: 'system-architecture-flow',
    title: 'easyFinance 系统四层全栈架构框图',
    titleEn: 'easyFinance 4-Tier System Architecture',
    subtitle: 'Shadow DOM 样式隔离、客观性过滤与 Gemini 3.8 Flash 低延迟翻译流转',
    subtitleEn: 'Shadow DOM isolation, regulatory objectivity filters, and Gemini 3.8 Flash pipeline',
    category: 'system',
    categoryLabel: '系统架构',
    categoryLabelEn: 'System Arch',
    nodes: [
      {
        id: 'layer1-ui',
        label: '1. 交互呈现层 (UI Layer)',
        labelEn: '1. Interaction UI Layer',
        desc: 'Shadow DOM (Open Mode) 彻底隔离宿主 CSS；macOS 极轻薄毛玻璃与无多余分割线设计',
        descEn: 'Shadow DOM style isolation, ultraThinMaterial blur, and zero redundant line dividers',
        mathFormula: 'attachShadow({ mode: "open" })',
        plainMeaning: '悬浮窗和划词小气泡浮在任何金融网页上，完全不受网页原有样式的污染或变形。',
        plainMeaningEn: 'Floating window rendered in isolated DOM, preventing target website styling conflicts.',
        type: 'source',
        tag: 'Shadow DOM'
      },
      {
        id: 'layer2-filter',
        label: '2. 客观合规过滤层 (Audit)',
        labelEn: '2. Regulatory Safety Filter',
        desc: '严格剥离买卖建议与走势预测偏向，强制归一化为纯客观的概念定义与数学公式',
        descEn: 'Filters out speculative investment advice and normalizes to educational definitions',
        mathFormula: 'Strict: No investment advice · Concept & math only',
        plainMeaning: '绝对不推荐股票基金，只帮你看清数字怎么算、合同怎么写。',
        plainMeaningEn: 'Never offers buy/sell advice; strictly deconstructs accounting math and contractual terms.',
        type: 'process',
        tag: '中立客观'
      },
      {
        id: 'layer3-engine',
        label: '3. 词典与 AI 翻译引擎',
        labelEn: '3. Lexicon & Gemini AI Engine',
        desc: '本地离线高频词库（毫秒级命中）+ 服务端 Gemini 3.8 Flash 双模（白话通俗 / 专业金融逻辑）',
        descEn: 'Local high-frequency dictionary + Gemini 3.8 Flash dual-mode streaming backend',
        mathFormula: 'Local Match (1ms) || Gemini 3.8 Flash (Temp 0.1)',
        plainMeaning: '既能毫秒级秒出常见专业公式，又能随时一键召唤 AI 深度解析屏幕复杂段落。',
        plainMeaningEn: 'Ultra-fast 1ms local definitions coupled with Gemini AI deep screen deconstruction.',
        type: 'metric',
        tag: '双模双引擎'
      },
      {
        id: 'layer4-broadcast',
        label: '4. 事实广播与屏幕联接',
        labelEn: '4. Broadcast & Screen Context',
        desc: '宏观公开统计事实聚合 + Web Speech API 原生语音朗读 + 屏幕视觉上下文抽取',
        descEn: 'Official macro facts feed, native Web Speech read-aloud, and DOM screen extraction',
        mathFormula: 'window.speechSynthesis.speak(utterance)',
        plainMeaning: '实时同步央行和统计局客观数据，支持一键语音朗读，耳朵也能听明白财报。',
        plainMeaningEn: 'Real-time objective statistics with one-click native voice synthesis read-aloud.',
        type: 'destination',
        tag: '语音与屏幕'
      }
    ],
    connections: [
      { from: 'layer1-ui', to: 'layer2-filter', label: '划词/屏幕请求' },
      { from: 'layer2-filter', to: 'layer3-engine', label: '合规清洗后' },
      { from: 'layer3-engine', to: 'layer4-broadcast', label: '概念与公式' },
      { from: 'layer4-broadcast', to: 'layer1-ui', label: '双模呈现与朗读' }
    ],
    summaryPlain: '前端采用原生隔离技术保证在哪都不坏样式；中间层坚决不荐股只讲客观定义；后台本地词库与大模型双模并进；最后配上语音朗读和屏幕直读。',
    summaryPlainEn: 'Shadow DOM protects UI from host CSS clashes; compliance filter blocks speculative tips; dual-engine gives instant formulas and AI deconstruction with speech synthesis.',
    summaryPro: '基于 Chrome Extension MV3 规范架构，采用 Shadow DOM Open Mode 实现样式隔离；通过 Service Worker 协调通信；后端接入 Gemini 3.8 Flash 实现低延迟概念输出。',
    summaryProEn: 'Architected under Chrome Extension MV3 standards with Shadow DOM CSS isolation, background service worker bus, and server-side Gemini 3.8 Flash integration.'
  }
];

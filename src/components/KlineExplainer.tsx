import React, { useState } from 'react';
import { Calculator, ArrowRight, BarChart2, TrendingUp, Layers } from 'lucide-react';

interface KlineExplainerProps {
  onTriggerViolation?: (text: string) => void;
  onSelectTerm: (term: string) => void;
}

export const KlineExplainer: React.FC<KlineExplainerProps> = ({ onSelectTerm }) => {
  const [selectedElement, setSelectedElement] = useState<'candle-bull' | 'candle-bear' | 'ma-line' | 'macd'>('candle-bull');

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6 text-slate-100">
      {/* Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">K线与常用指标几何拆解</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            点击下方图元，实时查看价格四要素、移动平均线与 MACD 的数学计算原理与几何构成。
          </p>
        </div>

        {/* Quick Term Navigation */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onSelectTerm('K线')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
          >
            K线全貌
          </button>
          <button
            onClick={() => onSelectTerm('MACD')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
          >
            MACD原理
          </button>
        </div>
      </div>

      {/* Interactive Chart Canvas & Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Interactive SVG Chart */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800/90 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <div className="flex items-center gap-3">
              <span className="font-mono font-medium text-slate-200">SAMPLE-CHART</span>
              <span className="text-[11px] text-cyan-400 font-mono">MA5: 3,124.50</span>
              <span className="text-[11px] text-amber-400 font-mono">MA20: 3,108.20</span>
            </div>
            <span className="text-[11px] text-slate-500">点击图元切换分析</span>
          </div>

          {/* SVG Chart */}
          <div className="relative h-64 w-full bg-slate-900/40 rounded-xl border border-slate-800/80 p-2 overflow-hidden flex flex-col justify-between">
            <svg viewBox="0 0 500 240" className="w-full h-full select-none">
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="#1e293b" strokeDasharray="3,3" strokeWidth="0.8" />
              <line x1="0" y1="110" x2="500" y2="110" stroke="#1e293b" strokeDasharray="3,3" strokeWidth="0.8" />
              <line x1="0" y1="170" x2="500" y2="170" stroke="#1e293b" strokeDasharray="3,3" strokeWidth="0.8" />

              {/* 1. Bearish candle */}
              <g className="cursor-pointer group" onClick={() => setSelectedElement('candle-bear')}>
                <line x1="60" y1="60" x2="60" y2="150" stroke="#10b981" strokeWidth="1.5" />
                <rect x="52" y="80" width="16" height="50" fill="#10b981" rx="1" className="hover:opacity-80 transition-opacity" />
                <text x="60" y="50" textAnchor="middle" fill="#94a3b8" fontSize="10">阴线</text>
              </g>

              {/* 2. Small Doji */}
              <g className="cursor-pointer group">
                <line x1="120" y1="75" x2="120" y2="145" stroke="#64748b" strokeWidth="1.5" />
                <line x1="112" y1="110" x2="128" y2="110" stroke="#64748b" strokeWidth="2.5" />
                <text x="120" y="65" textAnchor="middle" fill="#64748b" fontSize="9">十字星</text>
              </g>

              {/* 3. Bullish Candle */}
              <g className="cursor-pointer group" onClick={() => setSelectedElement('candle-bull')}>
                <line x1="180" y1="45" x2="180" y2="160" stroke="#ef4444" strokeWidth="1.5" />
                <rect
                  x="172" y="70" width="16" height="70"
                  fill="#ef4444" rx="1"
                  stroke={selectedElement === 'candle-bull' ? '#38bdf8' : 'none'}
                  strokeWidth={selectedElement === 'candle-bull' ? '2' : '0'}
                  className="hover:opacity-80 transition-opacity"
                />
                <text x="180" y="35" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold">阳线</text>
              </g>

              {/* 4. Bullish Continuation */}
              <g className="cursor-pointer group">
                <line x1="240" y1="40" x2="240" y2="130" stroke="#ef4444" strokeWidth="1.5" />
                <rect x="232" y="55" width="16" height="45" fill="#ef4444" rx="1" />
              </g>

              {/* 5. Another Candle */}
              <g className="cursor-pointer group">
                <line x1="300" y1="30" x2="300" y2="110" stroke="#10b981" strokeWidth="1.5" />
                <rect x="292" y="45" width="16" height="40" fill="#10b981" rx="1" />
              </g>

              {/* Moving Average Line MA5 (Cyan) */}
              <path
                d="M 40 120 Q 120 115 180 95 T 320 60 T 460 50"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                className="cursor-pointer hover:stroke-cyan-300"
                onClick={() => setSelectedElement('ma-line')}
              />

              {/* Moving Average Line MA20 (Amber) */}
              <path
                d="M 40 135 Q 120 130 180 120 T 320 90 T 460 70"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2"
                strokeDasharray="4,2"
                className="cursor-pointer hover:stroke-amber-300"
                onClick={() => setSelectedElement('ma-line')}
              />

              {/* Moving average intersection highlight */}
              <g className="cursor-pointer" onClick={() => setSelectedElement('ma-line')}>
                <circle cx="210" cy="100" r="4" fill="#38bdf8" stroke="#090d16" strokeWidth="1.5" />
                <text x="210" y="122" textAnchor="middle" fill="#38bdf8" fontSize="10">
                  均线交点
                </text>
              </g>

              {/* MACD Histogram at bottom */}
              <g className="cursor-pointer" onClick={() => setSelectedElement('macd')}>
                <line x1="0" y1="205" x2="500" y2="205" stroke="#334155" strokeWidth="1" />
                <rect x="56" y="205" width="8" height="15" fill="#10b981" opacity="0.8" />
                <rect x="116" y="205" width="8" height="6" fill="#10b981" opacity="0.8" />
                <rect x="176" y="190" width="8" height="15" fill="#ef4444" opacity="0.8" />
                <rect x="236" y="180" width="8" height="25" fill="#ef4444" opacity="0.8" />
                <rect x="296" y="188" width="8" height="17" fill="#ef4444" opacity="0.8" />
                <text x="20" y="202" fill="#94a3b8" fontSize="10">MACD 柱</text>
              </g>
            </svg>
          </div>

          {/* Quick Selector Pills */}
          <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pt-1">
            {[
              { id: 'candle-bull', label: '阳线实体' },
              { id: 'candle-bear', label: '阴线与影线' },
              { id: 'ma-line', label: '移动平均线 (MA)' },
              { id: 'macd', label: 'MACD 算法指标' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedElement(tab.id as any)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  selectedElement === tab.id
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Detailed Breakdown */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800/90 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {selectedElement === 'candle-bull' && (
              <>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded bg-rose-500"></span>
                    阳线 (收盘价高于开盘价)
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    在特定时间周期内，交易以较低价格开盘，并在较高价格收盘。
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>四要素构成</span>
                    </div>
                    <ul className="text-xs text-slate-400 space-y-1 pl-4 list-disc">
                      <li><strong>开盘价 (Open)</strong>：实体下边缘</li>
                      <li><strong>收盘价 (Close)</strong>：实体上边缘</li>
                      <li><strong>最高价 (High)</strong>：上影线顶端</li>
                      <li><strong>最低价 (Low)</strong>：下影线底端</li>
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <Calculator className="w-3.5 h-3.5 text-cyan-400" />
                      <span>振幅与涨跌幅算法</span>
                    </div>
                    <div className="font-mono text-[11px] text-cyan-300 bg-slate-950 p-2 rounded-lg border border-slate-800">
                      涨跌幅 = (Close - 前收盘) / 前收盘 × 100%<br/>
                      振幅 = (High - Low) / 前收盘 × 100%
                    </div>
                  </div>
                </div>
              </>
            )}

            {selectedElement === 'candle-bear' && (
              <>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded bg-emerald-500"></span>
                    阴线 (收盘价低于开盘价)
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    在特定时间周期内，交易以较高价格开盘，并在较低价格收盘。
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>四要素位置</span>
                    </div>
                    <ul className="text-xs text-slate-400 space-y-1 pl-4 list-disc">
                      <li><strong>开盘价 (Open)</strong>：实体上边缘</li>
                      <li><strong>收盘价 (Close)</strong>：实体下边缘</li>
                      <li><strong>影线 (Shadow)</strong>：反映日内极值区间</li>
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-400" />
                      <span>实体与影线意义</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      长影线反映日内曾出现显著拉升或下挫后回落，记录了买卖博弈留下的极端价格痕迹。
                    </p>
                  </div>
                </div>
              </>
            )}

            {selectedElement === 'ma-line' && (
              <>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded bg-cyan-400"></span>
                    移动平均线 (MA)
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    对过去 N 个交易周期的收盘价进行算术平均，消除单日随机噪音。
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <Calculator className="w-3.5 h-3.5 text-cyan-400" />
                      <span>算术平均公式</span>
                    </div>
                    <div className="font-mono text-[11px] text-cyan-300 bg-slate-950 p-2 rounded-lg border border-slate-800">
                      MA(N) = (Close_1 + Close_2 + ... + Close_N) / N
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                      <span>快线与慢线交汇</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      短期均线（如MA5）变化更敏感，长期均线（如MA20）更平滑。两线相交是短期与长期均值重合的几何现象。
                    </p>
                  </div>
                </div>
              </>
            )}

            {selectedElement === 'macd' && (
              <>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded bg-amber-400"></span>
                    MACD 指标
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    通过指数平滑移动平均（EMA）计算差离值，观察价格运动的速度变化。
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <Calculator className="w-3.5 h-3.5 text-amber-400" />
                      <span>核心推导公式</span>
                    </div>
                    <div className="font-mono text-[11px] text-amber-300 bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-1">
                      <div>DIF = EMA(12) - EMA(26)</div>
                      <div>DEA = EMA(DIF, 9)</div>
                      <div>MACD柱 = 2 × (DIF - DEA)</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="text-xs font-semibold text-slate-200">
                      <span>红绿柱含义</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      柱状线高度直接等于 DIF 与 DEA 差值的2倍。柱子由短变长或由长变短，反映差值在扩大或收敛。
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => onSelectTerm(selectedElement === 'macd' ? 'MACD' : 'K线')}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
          >
            <span>在词典中查看该词白话释义</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

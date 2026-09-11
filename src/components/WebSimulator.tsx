import React, { useState, useRef } from 'react';
import { DEMO_ARTICLES } from '../data/financialKnowledge';
import { DemoArticle } from '../types';
import { Sparkles, Globe, FileText, ArrowRight } from 'lucide-react';

interface WebSimulatorProps {
  onTranslateText: (text: string, context?: string) => void;
  onOpenKlineExplainer: () => void;
}

export const WebSimulator: React.FC<WebSimulatorProps> = ({
  onTranslateText,
  onOpenKlineExplainer
}) => {
  const [selectedArticleId, setSelectedArticleId] = useState<string>('fund-fee');
  const [floatingTooltip, setFloatingTooltip] = useState<{
    x: number;
    y: number;
    text: string;
    visible: boolean;
  }>({ x: 0, y: 0, text: '', visible: false });

  const containerRef = useRef<HTMLDivElement>(null);
  const currentArticle = DEMO_ARTICLES.find((a) => a.id === selectedArticleId) || DEMO_ARTICLES[0];

  // Mouseup listener for selection
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setFloatingTooltip((prev) => ({ ...prev, visible: false }));
      return;
    }

    const text = selection.toString().trim();
    if (text.length >= 2 && text.length <= 50) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();

      if (containerRect) {
        setFloatingTooltip({
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top - 40,
          text: text,
          visible: true
        });
      }
    } else {
      setFloatingTooltip((prev) => ({ ...prev, visible: false }));
    }
  };

  const renderHighlightedContent = (article: DemoArticle) => {
    const paragraphs = article.content.split('\n');
    return paragraphs.map((paragraph, pIdx) => {
      let remaining = paragraph;
      const nodes: React.ReactNode[] = [];
      let keyIdx = 0;

      while (remaining.length > 0) {
        let earliestMatch: { term: string; index: number } | null = null;
        for (const term of article.highlightedTerms) {
          const index = remaining.indexOf(term);
          if (index !== -1 && (earliestMatch === null || index < earliestMatch.index)) {
            earliestMatch = { term, index };
          }
        }

        if (!earliestMatch) {
          nodes.push(remaining);
          break;
        }

        if (earliestMatch.index > 0) {
          nodes.push(remaining.substring(0, earliestMatch.index));
        }

        const matchedTerm = earliestMatch.term;
        nodes.push(
          <button
            key={`term-${pIdx}-${keyIdx++}`}
            onClick={(e) => {
              e.stopPropagation();
              onTranslateText(matchedTerm, paragraph);
            }}
            className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded-md bg-slate-800 text-cyan-300 hover:bg-cyan-500/20 hover:text-cyan-200 border border-slate-700 hover:border-cyan-500/30 text-xs font-medium cursor-pointer transition-all"
            title={`点击在 easyFinance 中解释：${matchedTerm}`}
          >
            {matchedTerm}
          </button>
        );

        remaining = remaining.substring(earliestMatch.index + matchedTerm.length);
      }

      return (
        <p key={pIdx} className="mb-3.5 leading-relaxed text-slate-300 text-sm">
          {nodes}
        </p>
      );
    });
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden text-slate-100 shadow-xl">
      {/* Simulated Browser URL bar */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="flex gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-[11px] font-mono">
            <Globe className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="truncate max-w-[240px] sm:max-w-md">
              https://disclosure.sample.org/doc/{selectedArticleId}
            </span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 hidden sm:block">
          在正文中选择任意文字即可划词解析
        </div>
      </div>

      {/* Document Category Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900/40 overflow-x-auto px-2 pt-1 gap-1">
        {DEMO_ARTICLES.map((article) => (
          <button
            key={article.id}
            onClick={() => {
              setSelectedArticleId(article.id);
              setFloatingTooltip((prev) => ({ ...prev, visible: false }));
            }}
            className={`px-3.5 py-2 text-xs font-medium whitespace-nowrap rounded-t-xl transition-all flex items-center gap-1.5 border-t border-x ${
              selectedArticleId === article.id
                ? 'bg-slate-900 text-white border-slate-800 border-b-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{article.category}</span>
          </button>
        ))}
      </div>

      {/* Article Content Container */}
      <div
        ref={containerRef}
        onMouseUp={handleMouseUp}
        className="relative p-6 sm:p-8 max-w-4xl mx-auto min-h-[360px]"
      >
        {/* Floating Tooltip directly above text selection */}
        {floatingTooltip.visible && (
          <div
            style={{ left: `${floatingTooltip.x}px`, top: `${floatingTooltip.y}px` }}
            className="absolute -translate-x-1/2 z-30 animate-in fade-in zoom-in-95 duration-100"
          >
            <button
              onClick={() => {
                onTranslateText(floatingTooltip.text);
                setFloatingTooltip((prev) => ({ ...prev, visible: false }));
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950 text-cyan-400 border border-cyan-500/50 shadow-xl text-xs font-medium hover:bg-slate-900 hover:scale-105 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>解析 “{floatingTooltip.text.length > 8 ? floatingTooltip.text.slice(0, 8) + '...' : floatingTooltip.text}”</span>
            </button>
          </div>
        )}

        {/* Article Header */}
        <div className="mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
              {currentArticle.category}
            </span>
            <span className="text-xs text-slate-500">来源: {currentArticle.source}</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
            {currentArticle.title}
          </h2>
        </div>

        {/* Article Body */}
        <div className="prose prose-invert max-w-none">
          {renderHighlightedContent(currentArticle)}
        </div>

        {/* Quick K-Line Banner if in K-line document */}
        {selectedArticleId === 'kline-macd' && (
          <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-slate-200">想要查看 K线 与 MACD 交互图解？</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                支持点击图元分解四要素与数学平滑公式
              </div>
            </div>
            <button
              onClick={onOpenKlineExplainer}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-semibold text-xs hover:bg-cyan-400 transition-colors shrink-0 flex items-center gap-1"
            >
              <span>查看图解</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Simulator Bottom Bar */}
      <div className="px-5 py-2.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <span>直接用鼠标在任意正文划词，或点击高亮词汇</span>
        <span className="font-mono text-[11px]">easyFinance Extension Sandbox</span>
      </div>
    </div>
  );
};

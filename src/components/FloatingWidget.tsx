import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, X, Newspaper, Search, Send, Radio, Sparkles } from 'lucide-react';
import { FinancialBulletin, TranslationResult } from '../types';
import { SAMPLE_BULLETINS } from '../data/financialKnowledge';

interface FloatingWidgetProps {
  onSearchTerm: (term: string) => void;
  activeTranslation: TranslationResult | null;
}

export const FloatingWidget: React.FC<FloatingWidgetProps> = ({ onSearchTerm, activeTranslation }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'news' | 'search'>('news');
  const [bulletins] = useState<FinancialBulletin[]>(SAMPLE_BULLETINS);
  const [currentNewsIndex, setCurrentNewsIndex] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Position coordinates for dragging
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 24, y: 110 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({
    startX: 0, startY: 0, initialX: 24, initialY: 110
  });

  // News ticker interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % bulletins.length);
    }, 9000);
    return () => clearInterval(interval);
  }, [bulletins.length]);

  // Web Speech API for real-time voice broadcasting
  const speakCurrentNews = (indexToSpeak?: number) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    if (isSpeaking && indexToSpeak === undefined) {
      setIsSpeaking(false);
      return;
    }

    const targetIndex = indexToSpeak !== undefined ? indexToSpeak : currentNewsIndex;
    const item = bulletins[targetIndex];
    if (!item) return;

    const utterance = new SpeechSynthesisUtterance(
      `资讯播报。${item.type}：${item.title}。${item.summary}`
    );
    utterance.lang = 'zh-CN';
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.no-drag')) return;
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = dragStartRef.current.startX - e.clientX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    const newX = Math.max(16, Math.min(window.innerWidth - 68, dragStartRef.current.initialX + deltaX));
    const newY = Math.max(20, Math.min(window.innerHeight - 76, dragStartRef.current.initialY + deltaY));

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchTerm(searchQuery.trim());
      setSearchQuery('');
    }
  };

  const currentNews = bulletins[currentNewsIndex];

  return (
    <div
      id="easyfinance-floating-container"
      className="fixed z-50 select-none font-sans"
      style={{ right: `${position.x}px`, top: `${position.y}px` }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Floating Ball & Compact Ticker */}
      <div className="relative flex items-center group">
        {/* Subtle breathing ripple when audio playing */}
        {isSpeaking && (
          <span className="absolute -inset-1.5 rounded-full bg-cyan-400/25 animate-ping pointer-events-none" />
        )}

        {/* Minimalist Floating Button */}
        <button
          id="easyfinance-ball-btn"
          onClick={() => setIsOpen(!isOpen)}
          className={`relative flex items-center justify-center w-12 h-12 rounded-2xl shadow-xl transition-all duration-200 cursor-grab active:cursor-grabbing border ${
            isOpen
              ? 'bg-slate-900 border-cyan-400 text-cyan-400 shadow-cyan-500/10'
              : 'bg-slate-950 border-slate-800 text-white hover:border-slate-700 hover:scale-105'
          }`}
          title="easyFinance 悬浮助手 (拖拽移动，点击展开)"
        >
          <div className="flex flex-col items-center justify-center">
            <span className="text-[13px] font-bold text-cyan-400 tracking-tighter">eF</span>
          </div>

          {/* Status Indicator Dot */}
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isSpeaking ? 'bg-cyan-400 opacity-75' : 'bg-slate-600 opacity-20'}`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 border-2 border-slate-950 ${isSpeaking ? 'bg-cyan-400' : 'bg-slate-500'}`}></span>
          </span>
        </button>

        {/* Minimalist Ticker Pill beside ball when collapsed */}
        {!isOpen && currentNews && (
          <div
            onClick={() => setIsOpen(true)}
            className="no-drag hidden sm:flex items-center gap-2 ml-3 px-3 py-1.5 bg-slate-950/90 backdrop-blur-md border border-slate-800/90 rounded-full shadow-lg text-xs text-slate-300 cursor-pointer max-w-[240px] truncate hover:border-cyan-500/40 transition-colors"
          >
            <Radio className="w-3 h-3 text-cyan-400 shrink-0 animate-pulse" />
            <span className="truncate text-[11px] text-slate-300">{currentNews.title}</span>
          </div>
        )}
      </div>

      {/* Clean Expanded Popover Panel */}
      {isOpen && (
        <div
          id="easyfinance-expanded-panel"
          className="no-drag absolute top-14 right-0 w-[350px] sm:w-[380px] bg-slate-950/95 text-slate-100 rounded-2xl shadow-2xl border border-slate-800/90 backdrop-blur-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900/60 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="font-bold text-sm tracking-tight text-white">easyFinance</span>
              <span className="text-[11px] text-slate-400">悬浮助手</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Clean Segmented Tabs */}
          <div className="flex border-b border-slate-800/80 bg-slate-900/40 p-1 gap-1">
            <button
              onClick={() => setActiveTab('news')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'news'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              实时资讯
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'search'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              术语检索
            </button>
          </div>

          {/* Tab 1: Real-time News Bulletins */}
          {activeTab === 'news' && (
            <div className="p-3.5 space-y-3 max-h-[360px] overflow-y-auto">
              {/* Minimal Audio Player Bar */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg ${isSpeaking ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                    {isSpeaking ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">
                      {isSpeaking ? '正在语音播报...' : '快讯语音广播'}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      宏观经济与市场客观要闻
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => speakCurrentNews()}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isSpeaking
                      ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                      : 'bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400'
                  }`}
                >
                  {isSpeaking ? '停止' : '朗读'}
                </button>
              </div>

              {/* Bulletins List */}
              <div className="space-y-2">
                {bulletins.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setCurrentNewsIndex(idx);
                      speakCurrentNews(idx);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      currentNewsIndex === idx
                        ? 'bg-slate-900/90 border-cyan-500/50'
                        : 'bg-slate-900/30 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                        {item.type}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{item.time}</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-200 mb-1 leading-snug">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </div>
                    <div className="mt-2 text-[10px] text-slate-500">
                      来源: {item.source}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Term Translation Search */}
          {activeTab === 'search' && (
            <div className="p-3.5 space-y-3">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="输入金融词汇（如 MACD、管理费、年化利率）"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all pr-9"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 p-1 text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Quick sample chips */}
              <div className="space-y-1.5">
                <div className="text-[11px] text-slate-400 font-medium">常用查询：</div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'MACD',
                    '管理费',
                    '年化利率',
                    '等额本息',
                    '商誉减值',
                    '市盈率'
                  ].map((term) => (
                    <button
                      key={term}
                      onClick={() => onSearchTerm(term)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white transition-all"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Active Translation Preview */}
              {activeTranslation && (
                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 mt-2 space-y-1">
                  <div className="text-xs font-bold text-cyan-300">
                    {activeTranslation.term}
                  </div>
                  <div className="text-[11px] text-slate-300 leading-relaxed line-clamp-3">
                    {activeTranslation.plainText}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Minimalist Footer */}
          <div className="px-4 py-2 bg-slate-900/40 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>拖拽球体可自由调整吸附位置</span>
            <span>easyFinance v1.0</span>
          </div>
        </div>
      )}
    </div>
  );
};

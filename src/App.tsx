import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, FileText, BarChart2, DollarSign, BookOpen, 
  Sparkles, ExternalLink, ChevronRight, ChevronLeft, Edit3, Check,
  GitFork, Layers, X, Crop, Monitor, PieChart, TrendingUp, Calculator,
  Box, Laptop, Minimize2, AppWindow
} from 'lucide-react';
import { FloatingAssistant } from './components/FloatingAssistant';
import { ArchitecturePlanView } from './components/ArchitecturePlanView';
import { QuickDiagramView } from './components/QuickDiagramView';
import { AreaSnippingModal } from './components/AreaSnippingModal';
import { MacScanSweeper } from './components/MacScanSweeper';
import { DesktopPackagingModal } from './components/DesktopPackagingModal';
import { DEMO_ARTICLES } from './data/financialKnowledge';
import { ScreenContextData } from './types';

export default function App() {
  const [selectedDocId, setSelectedDocId] = useState<string>('fund-fee');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState<boolean>(true);
  const [showPackagingModal, setShowPackagingModal] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>(
    '【自选理财产品费率说明】\n本稳健理财计划综合年化管理费为0.65%，托管费0.10%。采用每日计提方式，无论净值是否上涨均按日扣除。预期年化收益率4.20%不代表保本承诺。若提前终止将扣除0.50%惩罚性退出费。'
  );
  const [customTitle, setCustomTitle] = useState<string>('用户自定义导入屏幕内容');
  const [isScanningVisual, setIsScanningVisual] = useState<boolean>(false);
  const [selectedSnippetTerm, setSelectedSnippetTerm] = useState<string | null>(null);
  const [showDiagramModal, setShowDiagramModal] = useState<boolean>(false);
  const [diagramModalTab, setDiagramModalTab] = useState<'financial' | 'system'>('financial');
  
  // Custom Area Snipping State
  const [isAreaSnippingOpen, setIsAreaSnippingOpen] = useState<boolean>(false);
  const [capturedAreaContext, setCapturedAreaContext] = useState<ScreenContextData | null>(null);
  const [isMac, setIsMac] = useState<boolean>(false);

  // Platform detection for Mac vs Windows hotkeys
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent || '';
      const platform = (window.navigator as unknown as { userAgentData?: { platform?: string } }).userAgentData?.platform || window.navigator.platform || '';
      setIsMac(/Mac|iP(hone|od|ad)/i.test(ua) || /Mac/i.test(platform));
    }
  }, []);

  // Global cross-platform hotkey listeners (Mac: Cmd+Shift+4 / Cmd+Shift+S; Windows: Alt+S / Ctrl+Shift+S)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Avoid intercepting input if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      // Quick Document Switching via Number Keys 1-5
      if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        if (e.key === '1') {
          setSelectedDocId('fund-fee');
          setIsCustomMode(false);
          return;
        } else if (e.key === '2') {
          setSelectedDocId('kline-macd');
          setIsCustomMode(false);
          return;
        } else if (e.key === '3') {
          setSelectedDocId('financial-math');
          setIsCustomMode(false);
          return;
        } else if (e.key === '4') {
          setSelectedDocId('corp-report');
          setIsCustomMode(false);
          return;
        } else if (e.key === '5') {
          setIsCustomMode(true);
          return;
        }
      }

      // Mac: Command + Shift + 4 or Command + Shift + S
      if (e.metaKey && e.shiftKey && (e.key === '4' || e.key === '$' || e.key.toLowerCase() === 's')) {
        e.preventDefault();
        setIsAreaSnippingOpen(true);
        return;
      }

      // Windows / Linux: Alt + S or Ctrl + Shift + S
      if ((e.altKey && e.key.toLowerCase() === 's') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's')) {
        e.preventDefault();
        setIsAreaSnippingOpen(true);
        return;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Selected article
  const currentDoc = DEMO_ARTICLES.find((d) => d.id === selectedDocId) || DEMO_ARTICLES[0];

  // Pure helper to retrieve current screen context without side effects or state updates
  const getScreenContextData = (): ScreenContextData => {
    if (isCustomMode) {
      return {
        title: customTitle,
        source: '用户屏幕当前文本区',
        text: customText,
        timestamp: new Date().toLocaleTimeString(),
        previewSnippet: customText.slice(0, 80),
        captureType: 'full'
      };
    }

    return {
      title: currentDoc.title,
      source: currentDoc.source,
      text: currentDoc.content,
      timestamp: new Date().toLocaleTimeString(),
      previewSnippet: currentDoc.content.slice(0, 80),
      captureType: 'full'
    };
  };

  // Screen reading callback invoked on user click (triggers visual scanning sweep)
  const handleCaptureScreenContent = (): ScreenContextData => {
    setIsScanningVisual(true);
    setTimeout(() => setIsScanningVisual(false), 750);
    return getScreenContextData();
  };

  // Handler when user confirms custom area crop
  const handleConfirmAreaCrop = (cropData: ScreenContextData) => {
    setIsScanningVisual(true);
    setTimeout(() => setIsScanningVisual(false), 750);
    setCapturedAreaContext(cropData);
  };

  // Text selection handler on the screen
  const handleScreenMouseUp = (e: React.MouseEvent) => {
    // Avoid triggering selection when interacting with floating assistant or modal
    const target = e.target as HTMLElement;
    if (target.closest('#easyfinance-floating-window') || target.closest('.snipping-interactive-control')) {
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      return;
    }
    const text = selection.toString().trim();
    if (text.length >= 2 && text.length <= 40) {
      setSelectedSnippetTerm(text);
    }
  };

  return (
    <div 
      id="easyfinance-desktop-screen"
      className="relative min-h-screen bg-zinc-100 text-zinc-900 font-sans flex flex-col select-text"
      onMouseUp={handleScreenMouseUp}
    >
      {/* macOS Native Smooth Gradient Scan Sweeper (Replaces abrupt flash line) */}
      <MacScanSweeper isScanning={isScanningVisual} />

      {isWorkspaceOpen ? (
        <>
          {/* Tier 1: Window Chrome, Breadcrumb & Action Tools */}
          <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-black/[0.06] px-4 sm:px-6 h-12 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          {/* Simulated Apple macOS Window Traffic Light Controls */}
          <div className="flex items-center gap-2 mr-1">
            <button 
              onClick={() => setIsWorkspaceOpen(false)}
              className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 inline-block shadow-xs hover:opacity-75 transition-all active:scale-90"
              title="收起研读窗口 (进入真实电脑纯净悬浮模式)"
            />
            <button 
              onClick={() => setIsWorkspaceOpen(false)}
              className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 inline-block shadow-xs hover:opacity-75 transition-all active:scale-90"
              title="最小化研读窗口"
            />
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 inline-block shadow-xs"></span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-zinc-700">
            <Monitor className="w-3.5 h-3.5 text-[#007AFF]" />
            <span>easyFinance 研读屏幕</span>
          </div>

          <div className="h-3.5 w-px bg-black/[0.08] hidden sm:block" />

          {/* Current Screen Source Badge */}
          <div className="flex items-center gap-2 text-xs text-[#8E8E93] bg-black/[0.03] border border-black/[0.04] px-2.5 py-1 rounded-[10px]">
            <Globe className="w-3.5 h-3.5 text-[#007AFF]" />
            <span className="font-mono text-[11px] truncate max-w-[180px] sm:max-w-xs md:max-w-md text-[#1C1C1E]">
              {isCustomMode ? 'custom://workspace/active-screen' : `disclosure://documents/${currentDoc.id}`}
            </span>
          </div>
        </div>

        {/* Global Screen Action Utilities: Streamlined, Spacious & Purposeful */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Functional Analysis Capsule */}
          <div className="flex items-center bg-black/[0.04] p-0.5 rounded-[12px] border border-black/[0.04]">
            {/* Quick Diagram / Architecture Studio Entry */}
            <button
              onClick={() => setShowDiagramModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-[10px] text-xs font-semibold text-[#007AFF] hover:bg-white hover:shadow-2xs transition-all"
              title="查看快捷数理逻辑框图与系统架构方案"
            >
              <GitFork className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">框图</span>
            </button>

            {/* Cross-platform Custom Area Snipping Button */}
            <button
              onClick={() => setIsAreaSnippingOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-[10px] text-xs font-semibold text-[#1C1C1E] hover:bg-white hover:shadow-2xs transition-all group"
              title={isMac ? "自定义框选截屏 (快捷键: ⌘+Shift+4)" : "自定义框选截屏 (快捷键: Win+Shift+S 或 Alt+S)"}
            >
              <Crop className="w-3.5 h-3.5 text-[#007AFF]" />
              <span>选区截屏</span>
              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-black/[0.04] text-[#8E8E93] group-hover:text-[#1C1C1E] transition-colors hidden md:inline">
                {isMac ? '⌘⇧4' : 'Win⇧S'}
              </span>
            </button>
          </div>

          {/* Primary Window Action: Clean, Distinctive & Not Crowded */}
          <button
            onClick={() => setIsWorkspaceOpen(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] text-xs font-bold bg-[#1C1C1E] hover:bg-black text-white transition-all shadow-xs active:scale-95"
            title="收起研读窗口，返回真实电脑纯净桌面悬浮状态"
          >
            <Minimize2 className="w-3.5 h-3.5 text-zinc-300" />
            <span>收起窗口</span>
          </button>

          {/* Packaging Guide Button (Discreet Icon) */}
          <button
            onClick={() => setShowPackagingModal(true)}
            className="p-1.5 rounded-[11px] text-zinc-500 hover:text-[#007AFF] hover:bg-black/[0.04] transition-all"
            title="真实电脑安装包 (Tauri/Electron) 构建与运行机制"
          >
            <Box className="w-4 h-4 text-[#007AFF]" />
          </button>
        </div>
      </header>

      {/* Tier 2: Ergonomic Workspace Document Segmented Bar (宽敞人性化分栏，不拥挤、不碰滑杆) */}
      <nav className="sticky top-12 z-20 bg-[rgba(248,249,252,0.95)] backdrop-blur-xl border-b border-black/[0.06] px-4 sm:px-6 py-2 shadow-xs">
        <div className="max-w-4xl w-full mx-auto flex items-center justify-between gap-3">
          {/* Spacious Document Segmented Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 p-1 rounded-[14px] bg-black/[0.04] border border-black/[0.03] overflow-x-auto no-scrollbar w-full sm:w-auto">
            {DEMO_ARTICLES.map((doc, idx) => {
              const isSelected = !isCustomMode && selectedDocId === doc.id;
              const icons = [
                <PieChart key="1" className="w-3.5 h-3.5 shrink-0" />,
                <TrendingUp key="2" className="w-3.5 h-3.5 shrink-0" />,
                <Calculator key="3" className="w-3.5 h-3.5 shrink-0" />,
                <BookOpen key="4" className="w-3.5 h-3.5 shrink-0" />
              ];
              return (
                <button
                  key={doc.id}
                  onClick={() => {
                    setSelectedDocId(doc.id);
                    setIsCustomMode(false);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-[11px] text-xs font-semibold transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-white text-[#007AFF] shadow-[0_2px_8px_rgba(0,122,255,0.14)] font-bold scale-[1.01]'
                      : 'text-[#636366] hover:text-[#1C1C1E] hover:bg-white/60'
                  }`}
                  title={`${doc.category} (按键 ${idx + 1})`}
                >
                  <span className={isSelected ? 'text-[#007AFF]' : 'text-[#8E8E93]'}>
                    {icons[idx] || <FileText className="w-3.5 h-3.5" />}
                  </span>
                  <span>{doc.category}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isSelected ? 'bg-[#007AFF]/10 text-[#007AFF]' : 'bg-black/[0.04] text-[#8E8E93]'
                  } hidden md:inline-block`}>
                    {idx + 1}
                  </span>
                </button>
              );
            })}

            <button
              onClick={() => setIsCustomMode(true)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-[11px] text-xs font-semibold transition-all whitespace-nowrap ${
                isCustomMode
                  ? 'bg-white text-[#007AFF] shadow-[0_2px_8px_rgba(0,122,255,0.14)] font-bold scale-[1.01]'
                  : 'text-[#636366] hover:text-[#1C1C1E] hover:bg-white/60'
              }`}
              title="输入或粘贴自定义内容 (按键 5)"
            >
              <Edit3 className={`w-3.5 h-3.5 shrink-0 ${isCustomMode ? 'text-[#007AFF]' : 'text-[#8E8E93]'}`} />
              <span>自定义屏幕</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                isCustomMode ? 'bg-[#007AFF]/10 text-[#007AFF]' : 'bg-black/[0.04] text-[#8E8E93]'
              } hidden md:inline-block`}>
                5
              </span>
            </button>
          </div>

          {/* Quick Switching Tip */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium shrink-0">
            <span>快捷键:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-zinc-200 text-zinc-600 font-mono text-[10px] shadow-xs">1-5</kbd>
            <span>秒切文档</span>
          </div>
        </div>
      </nav>

      {/* Main Screen Content Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-5 sm:p-8 space-y-6">
        {/* Custom Screen Editor Mode */}
        {isCustomMode ? (
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-zinc-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  当前屏幕内容输入与模拟
                </span>
              </div>
              <span className="text-xs text-zinc-400">悬浮助手可读取此区域</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">屏幕标题</label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-zinc-200 rounded-xl outline-none focus:border-zinc-400 transition-colors"
                placeholder="例如：招募说明书、财报公告、借贷合同..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">正文内容 (支持任意财报、条款或指标说明)</label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                rows={8}
                className="w-full p-3.5 text-xs sm:text-sm border border-zinc-200 rounded-2xl outline-none focus:border-zinc-400 transition-colors leading-relaxed font-sans"
                placeholder="在此粘贴任意金融文档或网页文字，悬浮助手点击「读取屏幕内容」后即可直接提问..."
              />
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-zinc-500">
              <span>在右侧悬浮窗点击「读取屏幕内容」，即可向 AI 发问</span>
              <button
                onClick={() => handleCaptureScreenContent()}
                className="px-3.5 py-1.5 rounded-xl bg-[#007AFF] hover:bg-[#0066d6] text-white font-medium transition-colors shadow-sm shadow-[#007AFF]/20"
              >
                测试读取本屏
              </button>
            </div>
          </div>
        ) : (
          /* Active Document Surface */
          <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-9 shadow-sm space-y-6">
            {/* Document Header */}
            <div className="pb-5 border-b border-zinc-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-zinc-100 text-zinc-600 font-medium">
                  {currentDoc.category}
                </span>
                <span className="text-xs text-zinc-400">来源: {currentDoc.source}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 leading-snug">
                {currentDoc.title}
              </h2>
            </div>

            {/* Document Content */}
            <div className="prose prose-zinc max-w-none text-zinc-700 text-sm leading-relaxed space-y-4">
              {currentDoc.content.split('\n').map((para, pIdx) => (
                <p key={pIdx} className="leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {/* Quick Interactive Elements on Document */}
            {currentDoc.id === 'kline-macd' && (
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <BarChart2 className="w-5 h-5 text-zinc-500 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-zinc-800">屏幕图元：K线与 MACD 几何分解</div>
                    <div className="text-[11px] text-zinc-500">开盘价、收盘价、最高价、最低价与均线中枢</div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSnippetTerm('K线与MACD指标构成')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#007AFF] text-white text-xs font-semibold hover:bg-[#0066d6] transition-colors shrink-0 shadow-sm shadow-[#007AFF]/20"
                >
                  向悬浮窗提问此图
                </button>
              </div>
            )}

            {/* Document Footer Hint */}
            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-3">
                <span>在屏幕中用鼠标选中文字，悬浮助手将自动响应</span>
                <button
                  onClick={() => {
                    setShowDiagramModal(true);
                    setDiagramModalTab('financial');
                  }}
                  className="flex items-center gap-1 font-semibold text-[#007AFF] hover:underline"
                >
                  <GitFork className="w-3 h-3" />
                  <span>对应逻辑框图</span>
                </button>
              </div>
              <span>easyFinance 实时屏幕联接中</span>
            </div>
          </div>
        )}
      </main>
      </>
      ) : (
        /* Simulated Real Native Desktop Mode (When Workspace is Closed/Minimized) */
        <div className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-br from-[#0c101c] via-[#141b2d] to-[#0a0d18] text-white select-none">
          {/* Simulated macOS Native Menu Bar */}
          <div className="h-7 bg-black/40 backdrop-blur-2xl border-b border-white/10 px-4 flex items-center justify-between text-[11px] font-medium text-zinc-300 z-20">
            <div className="flex items-center gap-4">
              <span className="font-bold text-white text-xs cursor-default"></span>
              <span className="font-semibold text-white cursor-default">Finder</span>
              <span className="cursor-default hover:text-white">文件</span>
              <span className="cursor-default hover:text-white">编辑</span>
              <span className="cursor-default hover:text-white">显示</span>
              <span className="cursor-default hover:text-white">窗口</span>
              <span className="cursor-default hover:text-white">帮助</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px] text-zinc-400">
              <span className="flex items-center gap-1"><Monitor className="w-3 h-3 text-[#007AFF]" /> 100% 充电中</span>
              <span>Wi-Fi · 已连接</span>
              <span className="text-zinc-200">周五 15:30</span>
            </div>
          </div>

          {/* Desktop Center Ambient HUD Card */}
          <div className="flex-1 flex items-center justify-center p-6 relative z-10">
            <div className="max-w-md w-full p-6 sm:p-8 rounded-[28px] bg-white/[0.06] backdrop-blur-2xl border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.6)] text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#007AFF] to-[#004bb5] text-white mx-auto flex items-center justify-center shadow-lg shadow-[#007AFF]/30 ring-1 ring-white/30">
                <Monitor className="w-7 h-7" />
              </div>

              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>真实电脑纯净桌面模式 (Native HUD Mode)</span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  仅保留悬浮窗 · 穿透真实桌面
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
                  在真实电脑中，系统仅在屏幕顶层保留置顶悬浮窗，底层完全是您的炒股软件、财报PDF或交易网页。需要时可在悬浮窗内轻点「新建窗口」或下方按钮随时唤出研读工作台。
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <button
                  onClick={() => setIsWorkspaceOpen(true)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#007AFF] hover:bg-[#0066d6] text-white font-bold text-xs shadow-md shadow-[#007AFF]/30 transition-all flex items-center justify-center gap-2"
                >
                  <AppWindow className="w-4 h-4" />
                  <span>新建/展开研读屏幕窗口</span>
                </button>

                <button
                  onClick={() => setShowPackagingModal(true)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-200 border border-white/10 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Box className="w-4 h-4 text-[#007AFF]" />
                  <span>真实安装包方案</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* macOS Style Quick Diagram & Architecture Studio Modal */}
      {showDiagramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/35 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[24px] bg-[rgba(250,250,252,0.96)] backdrop-blur-2xl border border-white/80 shadow-[0_25px_60px_rgba(0,122,255,0.14)] overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-black/[0.06] flex items-center justify-between bg-white/70">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setShowDiagramModal(false)}
                    className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 inline-block transition-transform hover:scale-110"
                    title="关闭"
                  />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 inline-block" />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C1C1E]">
                  <GitFork className="w-3.5 h-3.5 text-[#007AFF]" />
                  <span>快捷逻辑框图与系统架构</span>
                </div>
              </div>

              {/* Sub-tab segmented control */}
              <div className="flex items-center p-0.5 rounded-[12px] bg-black/[0.04]">
                <button
                  onClick={() => setDiagramModalTab('financial')}
                  className={`px-3 py-1 rounded-[10px] text-xs font-semibold transition-all ${
                    diagramModalTab === 'financial'
                      ? 'bg-white text-[#007AFF] shadow-xs'
                      : 'text-[#8E8E93] hover:text-[#1C1C1E]'
                  }`}
                >
                  金融链路框图
                </button>
                <button
                  onClick={() => setDiagramModalTab('system')}
                  className={`px-3 py-1 rounded-[10px] text-xs font-semibold transition-all ${
                    diagramModalTab === 'system'
                      ? 'bg-white text-[#007AFF] shadow-xs'
                      : 'text-[#8E8E93] hover:text-[#1C1C1E]'
                  }`}
                >
                  系统总体架构与工程骨架
                </button>
              </div>

              <button
                onClick={() => setShowDiagramModal(false)}
                className="w-7 h-7 rounded-full bg-black/[0.05] hover:bg-black/[0.1] text-[#8E8E93] hover:text-[#1C1C1E] flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0">
              {diagramModalTab === 'financial' ? (
                <QuickDiagramView
                  mode="plain"
                  language="zh"
                  activeScreenTitle={currentDoc.title}
                  onAskAboutDiagram={(_title, prompt) => {
                    setShowDiagramModal(false);
                    setSelectedSnippetTerm(prompt);
                  }}
                />
              ) : (
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-inner">
                  <ArchitecturePlanView />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Assistant (The Centerpiece of the entire app) */}
      <FloatingAssistant
        onCaptureScreen={handleCaptureScreenContent}
        onRequestAreaCrop={() => setIsAreaSnippingOpen(true)}
        initialScreenContext={capturedAreaContext}
        onSearchTerm={(term) => console.log('Search:', term)}
        externalTriggerTerm={selectedSnippetTerm}
        isWorkspaceOpen={isWorkspaceOpen}
        onToggleWorkspace={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
        onOpenPackagingGuide={() => setShowPackagingModal(true)}
      />

      {/* Interactive Custom Area Snipping Tool (Supports Mac, Windows & Touch/Pointer) */}
      <AreaSnippingModal
        isOpen={isAreaSnippingOpen}
        onClose={() => setIsAreaSnippingOpen(false)}
        onConfirmCrop={handleConfirmAreaCrop}
        fullScreenData={getScreenContextData()}
      />

      {/* Native Desktop Packaging & Architecture Guide Modal */}
      <DesktopPackagingModal
        isOpen={showPackagingModal}
        onClose={() => setShowPackagingModal(false)}
        onLaunchDesktopMode={() => setIsWorkspaceOpen(false)}
      />
    </div>
  );
}

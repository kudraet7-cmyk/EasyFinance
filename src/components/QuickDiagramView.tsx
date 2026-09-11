import React, { useState } from 'react';
import { 
  GitFork, ArrowRight, Sparkles, Layers, Check, 
  ExternalLink, ChevronRight, HelpCircle, FileText,
  CornerDownRight, Info, Eye, Zap, ShieldCheck
} from 'lucide-react';
import { DiagramFlow, DiagramNode, ExplanationMode } from '../types';
import { FINANCIAL_DIAGRAMS } from '../data/diagramData';

interface QuickDiagramViewProps {
  mode: ExplanationMode;
  language: 'zh' | 'en';
  isCompact?: boolean;
  onAskAboutDiagram?: (diagramTitle: string, question: string) => void;
  activeScreenTitle?: string;
  onSelectScreenDiagram?: (diagramId: string) => void;
}

export const QuickDiagramView: React.FC<QuickDiagramViewProps> = ({
  mode,
  language,
  isCompact = false,
  onAskAboutDiagram,
  activeScreenTitle
}) => {
  const [selectedDiagramId, setSelectedDiagramId] = useState<string>(() => {
    // Automatically match screen context if possible
    if (activeScreenTitle) {
      if (activeScreenTitle.includes('基金') || activeScreenTitle.includes('费率')) return 'fund-fee-flow';
      if (activeScreenTitle.includes('贷款') || activeScreenTitle.includes('利率') || activeScreenTitle.includes('IRR')) return 'loan-irr-flow';
      if (activeScreenTitle.includes('K线') || activeScreenTitle.includes('MACD')) return 'kline-macd-structure';
      if (activeScreenTitle.includes('财务指标') || activeScreenTitle.includes('ROE')) return 'dupont-analysis-tree';
    }
    return FINANCIAL_DIAGRAMS[0].id;
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const currentDiagram: DiagramFlow = 
    FINANCIAL_DIAGRAMS.find((d) => d.id === selectedDiagramId) || FINANCIAL_DIAGRAMS[0];

  const activeNode: DiagramNode = 
    (selectedNodeId && currentDiagram.nodes.find((n) => n.id === selectedNodeId)) || currentDiagram.nodes[0];

  const t = {
    zh: {
      title: '快捷逻辑框图',
      selectPrompt: '选择要拆解的结构链路：',
      screenAutoMatch: '根据当前屏幕智能推荐',
      nodeInspector: '节点参数明细',
      mathFormula: '底层数理公式',
      plainTranslation: '白话通俗含义',
      proStandard: '专业会计/统计口径',
      askAi: '向 AI 发问此框图',
      flowSummary: '链路核心逻辑',
      clickNodeHint: '点击任意节点查看定义与公式',
      sourceType: '数据源头',
      processType: '运算环节',
      metricType: '指标节点',
      destType: '终局去向',
      riskType: '风险要素',
    },
    en: {
      title: 'Quick Diagram',
      selectPrompt: 'Select structural flow:',
      screenAutoMatch: 'Screen recommended',
      nodeInspector: 'Node Inspector',
      mathFormula: 'Mathematical Formula',
      plainTranslation: 'Plain Language Meaning',
      proStandard: 'Accounting / Statistical Logic',
      askAi: 'Ask AI about this diagram',
      flowSummary: 'Flow Summary',
      clickNodeHint: 'Click any node to inspect formulas',
      sourceType: 'Source',
      processType: 'Process',
      metricType: 'Metric',
      destType: 'Destination',
      riskType: 'Risk Factor',
    }
  }[language];

  return (
    <div className={`flex flex-col h-full ${isCompact ? 'space-y-3' : 'space-y-5'}`}>
      {/* 1. Quick Diagram Selector (Apple Pill Scroll) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {FINANCIAL_DIAGRAMS.map((diag) => {
          const isSelected = diag.id === selectedDiagramId;
          const label = language === 'en' ? diag.categoryLabelEn : diag.categoryLabel;
          return (
            <button
              key={diag.id}
              onClick={() => {
                setSelectedDiagramId(diag.id);
                setSelectedNodeId(null);
              }}
              className={`px-3 py-1.5 rounded-[12px] text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#007AFF] text-white shadow-xs'
                  : 'bg-black/[0.04] text-[#1C1C1E] hover:bg-black/[0.08]'
              }`}
            >
              <GitFork className="w-3 h-3" strokeWidth={2} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Diagram Title & Context Banner */}
      <div className="bg-white/80 backdrop-blur-md rounded-[18px] p-3 shadow-xs border border-white/80">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold text-[#1C1C1E] tracking-tight">
              {language === 'en' ? currentDiagram.titleEn : currentDiagram.title}
            </h4>
            <p className="text-[11px] text-[#8E8E93] mt-0.5 leading-snug">
              {language === 'en' ? currentDiagram.subtitleEn : currentDiagram.subtitle}
            </p>
          </div>
          <span className="text-[9px] font-semibold text-[#007AFF] bg-[#E5F0FF] px-2 py-0.5 rounded-full shrink-0">
            {mode === 'professional' ? (language === 'en' ? 'Pro Logic' : '专业逻辑') : (language === 'en' ? 'Plain' : '白话通俗')}
          </span>
        </div>
      </div>

      {/* 3. Interactive Visual Diagram Flow Canvas */}
      <div className="bg-white/70 backdrop-blur-md rounded-[20px] p-3 sm:p-4 border border-white/60 shadow-xs flex-1 flex flex-col justify-between min-h-[220px]">
        <div className="text-[10px] text-[#8E8E93] mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1 font-medium">
            <Layers className="w-3 h-3 text-[#007AFF]" />
            <span>{t.clickNodeHint}</span>
          </span>
          <span className="font-mono text-[9px] text-[#8E8E93]">
            {currentDiagram.nodes.length} Nodes · {currentDiagram.connections.length} Links
          </span>
        </div>

        {/* Nodes and Connectors Grid / Flow */}
        <div className="space-y-2.5 my-auto">
          {currentDiagram.nodes.map((node, index) => {
            const isSelected = (selectedNodeId === node.id) || (!selectedNodeId && index === 0);
            const isLast = index === currentDiagram.nodes.length - 1;
            const nodeLabel = language === 'en' && node.labelEn ? node.labelEn : node.label;
            const nodeDesc = language === 'en' && node.descEn ? node.descEn : node.desc;
            const nodeTag = language === 'en' && node.tagEn ? node.tagEn : node.tag;

            return (
              <div key={node.id} className="relative">
                {/* Node Box */}
                <button
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`w-full text-left p-2.5 sm:p-3 rounded-[14px] transition-all flex items-center justify-between gap-2.5 ${
                    isSelected
                      ? 'bg-white text-[#1C1C1E] shadow-sm border-2 border-[#007AFF]/60 ring-2 ring-[#007AFF]/10'
                      : 'bg-white/60 hover:bg-white text-[#1C1C1E] border border-black/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-6 h-6 rounded-[8px] flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isSelected
                        ? 'bg-[#007AFF] text-white shadow-xs'
                        : 'bg-black/[0.05] text-[#8E8E93]'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#1C1C1E] truncate">
                          {nodeLabel}
                        </span>
                        {nodeTag && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-black/[0.04] text-[#8E8E93] font-normal shrink-0">
                            {nodeTag}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#8E8E93] truncate mt-0.5">
                        {nodeDesc}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1 text-[#8E8E93]">
                    {node.mathFormula && (
                      <span className="hidden sm:inline-block font-mono text-[10px] text-[#007AFF] bg-[#E5F0FF] px-2 py-0.5 rounded-md">
                        {node.mathFormula.slice(0, 16)}...
                      </span>
                    )}
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'rotate-90 text-[#007AFF]' : ''}`} />
                  </div>
                </button>

                {/* Connecting Arrow between nodes */}
                {!isLast && (
                  <div className="flex items-center justify-center py-0.5">
                    <div className="flex items-center gap-1 text-[10px] text-[#8E8E93] opacity-60">
                      <div className="w-0.5 h-2 bg-[#007AFF]/40 rounded-full" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 4. Active Node Detail Inspection Drawer */}
        <div className="mt-3 p-3 rounded-[16px] bg-white border border-black/[0.05] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#1C1C1E] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#007AFF]" />
              <span>{language === 'en' && activeNode.labelEn ? activeNode.labelEn : activeNode.label}</span>
            </span>
            <span className="text-[10px] text-[#8E8E93]">
              {mode === 'plain' ? t.plainTranslation : t.proStandard}
            </span>
          </div>

          {/* Math Formula if available */}
          {activeNode.mathFormula && (
            <div className="p-2 rounded-[10px] bg-black/[0.03] font-mono text-xs text-[#007AFF] break-all border border-black/[0.02]">
              <span className="text-[10px] text-[#8E8E93] block font-sans mb-0.5">{t.mathFormula}:</span>
              {activeNode.mathFormula}
            </div>
          )}

          {/* Plain / Pro explanation according to active mode */}
          <p className="text-xs text-[#1C1C1E] leading-relaxed">
            {mode === 'plain'
              ? (language === 'en' && activeNode.plainMeaningEn ? activeNode.plainMeaningEn : activeNode.plainMeaning)
              : (language === 'en' && activeNode.descEn ? activeNode.descEn : activeNode.desc)}
          </p>

          {/* One-click "Ask AI about this node" */}
          {onAskAboutDiagram && (
            <div className="pt-1 flex justify-end">
              <button
                onClick={() => {
                  const nodeTitle = language === 'en' && activeNode.labelEn ? activeNode.labelEn : activeNode.label;
                  const prompt = language === 'en'
                    ? `Please deconstruct the node "${nodeTitle}" from the ${currentDiagram.titleEn} diagram in depth.`
                    : `请深度拆解「${currentDiagram.title}」里的「${nodeTitle}」环节，包含计算原理与关键注意事项。`;
                  onAskAboutDiagram(currentDiagram.title, prompt);
                }}
                className="flex items-center gap-1 text-[11px] font-semibold text-[#007AFF] hover:underline"
              >
                <Sparkles className="w-3 h-3" />
                <span>{t.askAi}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 5. Bottom Logic Synthesis Footer */}
      <div className="p-3 rounded-[16px] bg-black/[0.03] text-[11px] text-[#8E8E93] leading-relaxed">
        <span className="font-semibold text-[#1C1C1E] mr-1">{t.flowSummary}:</span>
        {mode === 'plain'
          ? (language === 'en' ? currentDiagram.summaryPlainEn : currentDiagram.summaryPlain)
          : (language === 'en' ? currentDiagram.summaryProEn : currentDiagram.summaryPro)}
      </div>
    </div>
  );
};

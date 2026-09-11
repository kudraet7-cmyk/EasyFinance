import React, { useEffect } from 'react';
import { Sparkles, BookOpen, Calculator, Scale, X } from 'lucide-react';
import { TranslationResult } from '../types';

interface SelectionTranslatorProps {
  translation: TranslationResult | null;
  isLoading: boolean;
  onClose: () => void;
}

export const SelectionTranslator: React.FC<SelectionTranslatorProps> = ({
  translation,
  isLoading,
  onClose
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!translation && !isLoading) return null;

  return (
    <div
      id="easyfinance-translator-modal"
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-100"
      >
        {/* Clean Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 tracking-wide uppercase">easyFinance 术语拆解</span>
              <h3 className="text-base font-bold text-white leading-tight">
                {translation?.term || '正在查询...'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="关闭 (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <div className="w-7 h-7 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
              <div className="text-xs text-slate-400">正在进行白话解析与数据还原...</div>
            </div>
          ) : translation ? (
            <>
              {/* Section 1: Plain Language Translation */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-semibold">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>白话释义</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {translation.plainText}
                </p>
              </div>

              {/* Section 2: Mathematical Formula / Logic */}
              {translation.formula && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                    <Calculator className="w-3.5 h-3.5 text-cyan-400" />
                    <span>核心计算公式</span>
                  </div>
                  <div className="font-mono text-xs text-cyan-300/90 bg-slate-900/90 px-3 py-2.5 rounded-lg border border-slate-800 overflow-x-auto leading-relaxed">
                    {translation.formula}
                  </div>
                </div>
              )}

              {/* Section 3: Formal Accounting / Regulatory Definition */}
              {translation.formalDefinition && (
                <div className="p-3.5 rounded-xl bg-slate-800/20 border border-slate-800/60 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                    <Scale className="w-3.5 h-3.5 text-slate-400" />
                    <span>规范参考</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {translation.formalDefinition}
                  </p>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Clean Footer */}
        <div className="px-5 py-3 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span>快捷键：按 Esc 或点击遮罩关闭</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};

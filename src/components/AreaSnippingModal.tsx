import React, { useState, useEffect, useRef } from 'react';
import { 
  Crop, Check, X, RotateCcw, Monitor, Sparkles, 
  Command, Sliders, Move
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenContextData } from '../types';

interface AreaSnippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmCrop: (data: ScreenContextData) => void;
  fullScreenData: ScreenContextData;
}

interface SelectionBox {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

export const AreaSnippingModal: React.FC<AreaSnippingModalProps> = ({
  isOpen,
  onClose,
  onConfirmCrop,
  fullScreenData
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [selection, setSelection] = useState<SelectionBox | null>(null);
  const [hasCompletedSelection, setHasCompletedSelection] = useState<boolean>(false);
  
  // Platform detection for Mac vs Windows
  const [isMac, setIsMac] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent || '';
      const platform = (window.navigator as unknown as { userAgentData?: { platform?: string } }).userAgentData?.platform || window.navigator.platform || '';
      setIsMac(/Mac|iP(hone|od|ad)/i.test(ua) || /Mac/i.test(platform));
    }
  }, []);

  // Set default selection on modal open if none exists
  useEffect(() => {
    if (isOpen) {
      // Default to a centered 640x360 box so user can immediately adjust or confirm
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      const defaultW = Math.min(680, screenW * 0.75);
      const defaultH = Math.min(360, screenH * 0.55);
      const startX = Math.max(20, (screenW - defaultW) / 2);
      const startY = Math.max(60, (screenH - defaultH) / 2);

      setSelection({
        startX,
        startY,
        currentX: startX + defaultW,
        currentY: startY + defaultH
      });
      setHasCompletedSelection(true);
    } else {
      setSelection(null);
      setHasCompletedSelection(false);
      setIsDrawing(false);
    }
  }, [isOpen]);

  // Global keydown handler (Escape to close, Enter to confirm)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter' && selection) {
        handleConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selection]);

  // Calculate box geometry
  const left = selection ? Math.min(selection.startX, selection.currentX) : 0;
  const top = selection ? Math.min(selection.startY, selection.currentY) : 0;
  const width = selection ? Math.abs(selection.currentX - selection.startX) : 0;
  const height = selection ? Math.abs(selection.currentY - selection.startY) : 0;

  // Pointer event handlers for drawing custom box
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // If clicking on toolbar or buttons, do nothing
    if ((e.target as HTMLElement).closest('.snipping-interactive-control')) {
      return;
    }
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setHasCompletedSelection(false);
    setSelection({
      startX: x,
      startY: y,
      currentX: x,
      currentY: y
    });

    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDrawing || !selection) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    setSelection((prev) => prev ? { ...prev, currentX: x, currentY: y } : null);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDrawing) {
      setIsDrawing(false);
      setHasCompletedSelection(true);
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    }
  };

  // Preset size selectors
  const applyPresetSize = (targetW: number, targetH: number) => {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const w = Math.min(targetW, screenW - 40);
    const h = Math.min(targetH, screenH - 120);
    const startX = Math.max(20, (screenW - w) / 2);
    const startY = Math.max(70, (screenH - h) / 2);

    setSelection({
      startX,
      startY,
      currentX: startX + w,
      currentY: startY + h
    });
    setHasCompletedSelection(true);
  };

  // Confirm crop and build extracted content
  const handleConfirm = () => {
    if (!selection || width < 30 || height < 30) {
      onClose();
      return;
    }

    // Proportional text slicing based on vertical position
    const screenHeight = window.innerHeight;
    const topRatio = Math.max(0, Math.min(1, top / screenHeight));
    const bottomRatio = Math.max(0, Math.min(1, (top + height) / screenHeight));

    const fullText = fullScreenData.text || '';
    const lines = fullText.split('\n');
    const startLineIndex = Math.floor(topRatio * lines.length);
    const endLineIndex = Math.max(startLineIndex + 1, Math.ceil(bottomRatio * lines.length));
    const croppedLines = lines.slice(startLineIndex, endLineIndex);
    const croppedText = croppedLines.length > 0 ? croppedLines.join('\n') : fullText;

    const roundedW = Math.round(width);
    const roundedH = Math.round(height);

    const croppedData: ScreenContextData = {
      title: `自定义选区 [${roundedW} × ${roundedH}px] · ${fullScreenData.title}`,
      source: `${fullScreenData.source} (区域快照)`,
      text: croppedText,
      timestamp: new Date().toLocaleTimeString(),
      previewSnippet: croppedText.slice(0, 90),
      captureType: 'area',
      areaDimensions: { width: roundedW, height: roundedH }
    };

    onConfirmCrop(croppedData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="fixed inset-0 z-[60] cursor-crosshair select-none overflow-hidden"
          style={{ touchAction: 'none' }}
        >
        {/* Crisp unblurred backdrop when no selection yet; when selection exists, box-shadow dims the outside cleanly */}
        {(!selection || width <= 10 || height <= 10) && (
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />
        )}

        {/* Floating Top Hint Bar (macOS / Windows native style) */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="snipping-interactive-control absolute top-4 inset-x-0 mx-auto w-fit z-50 flex items-center gap-3 px-4 py-2 rounded-[16px] bg-[rgba(28,28,30,0.88)] backdrop-blur-xl border border-white/15 text-white shadow-2xl"
        >
          <div className="flex items-center gap-2">
            <Crop className="w-4 h-4 text-[#007AFF]" />
            <span className="text-xs font-semibold tracking-tight">
              拖拽鼠标框选屏幕截取区域
            </span>
          </div>

          <div className="h-3.5 w-px bg-white/20" />

          {/* Platform specific hotkey badge */}
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-300">
            <span>支持快捷键:</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/10 font-mono text-[10px] text-white border border-white/10">
              {isMac ? '⌘ + ⇧ + 4' : 'Win + ⇧ + S'}
            </span>
            <span className="text-zinc-400">或</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/10 font-mono text-[10px] text-white border border-white/10">
              Esc 取消
            </span>
          </div>

          <div className="h-3.5 w-px bg-white/20" />

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => applyPresetSize(540, 240)}
              className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-zinc-200 text-[11px] font-medium transition-colors"
            >
              紧凑 (540×240)
            </button>
            <button
              onClick={() => applyPresetSize(720, 360)}
              className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-zinc-200 text-[11px] font-medium transition-colors"
            >
              标准 (720×360)
            </button>
            <button
              onClick={() => applyPresetSize(920, 520)}
              className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-zinc-200 text-[11px] font-medium transition-colors"
            >
              大图表 (920×520)
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors ml-1"
            title="取消"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Crop Selection Window */}
        {selection && width > 10 && height > 10 && (
          <div
            className="absolute pointer-events-none transition-shadow"
            style={{
              left: `${left}px`,
              top: `${top}px`,
              width: `${width}px`,
              height: `${height}px`,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.40), 0 0 0 1px rgba(255, 255, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.25)',
              border: '2px solid #007AFF',
              borderRadius: '4px'
            }}
          >
            {/* Corner Markers (macOS Lens style) */}
            <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 border-t-3 border-l-3 border-[#007AFF]" />
            <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 border-t-3 border-r-3 border-[#007AFF]" />
            <div className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 border-b-3 border-l-3 border-[#007AFF]" />
            <div className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 border-b-3 border-r-3 border-[#007AFF]" />

            {/* Subtle center guide crosshair */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <div className="w-4 h-0.5 bg-[#007AFF]" />
              <div className="h-4 w-0.5 bg-[#007AFF] absolute" />
            </div>

            {/* Dimension Badge */}
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-[8px] bg-black/75 backdrop-blur-md text-[10px] font-mono text-white font-semibold shadow-md pointer-events-auto">
              {Math.round(width)} × {Math.round(height)} px
            </div>

            {/* Context Floating Action Bar at the bottom of selection */}
            {hasCompletedSelection && (
              <div
                className="snipping-interactive-control absolute pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-[14px] bg-[rgba(28,28,30,0.92)] backdrop-blur-xl border border-white/20 text-white shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100"
                style={{
                  bottom: top + height + 50 > window.innerHeight ? '8px' : '-46px',
                  right: '0px'
                }}
              >
                <button
                  onClick={() => {
                    setSelection(null);
                    setHasCompletedSelection(false);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-[10px] text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>重选</span>
                </button>

                <div className="h-3 w-px bg-white/20" />

                <button
                  onClick={onClose}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-[10px] text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-3 h-3" />
                  <span>取消</span>
                </button>

                <button
                  onClick={handleConfirm}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-[10px] text-xs font-semibold bg-[#007AFF] text-white shadow-[0_2px_8px_rgba(0,122,255,0.4)] hover:bg-[#0066d6] active:scale-[0.97] transition-all"
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>确认识别</span>
                </button>
              </div>
            )}
          </div>
        )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

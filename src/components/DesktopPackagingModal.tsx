import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Box, X, Check, Copy, Monitor, Laptop, Terminal, 
  ShieldCheck, Cpu, Sparkles, ExternalLink, Layers, ArrowRight
} from 'lucide-react';

interface DesktopPackagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchDesktopMode: () => void;
}

export const DesktopPackagingModal: React.FC<DesktopPackagingModalProps> = ({
  isOpen,
  onClose,
  onLaunchDesktopMode
}) => {
  const [activeTab, setActiveTab] = useState<'concept' | 'tauri' | 'electron'>('concept');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const TAURI_CONF = `{
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build",
    "devPath": "http://localhost:3000",
    "distDir": "../dist"
  },
  "package": {
    "productName": "easyFinance",
    "version": "1.0.0"
  },
  "tauri": {
    "windows": [
      {
        "title": "easyFinance HUD",
        "width": 420,
        "height": 620,
        "resizable": false,
        "transparent": true,
        "decorations": false,
        "alwaysOnTop": true,
        "skipTaskbar": false
      }
    ],
    "systemTray": {
      "iconPath": "icons/icon.png",
      "iconAsTemplate": true
    }
  }
}`;

  const TAURI_COMMANDS = `# 1. 安装 Tauri CLI
npm install -D @tauri-apps/cli

# 2. 本地一键打包为 Mac (.dmg) 或 Windows (.exe / .msi) 安装包
npm run tauri build`;

  const ELECTRON_SNIPPET = `// main.js - Electron 真实电脑置顶悬浮窗核心配置
const { app, BrowserWindow, screen } = require('electron');

app.whenReady().then(() => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width } = primaryDisplay.workAreaSize;

  const win = new BrowserWindow({
    width: 420,
    height: 620,
    x: width - 450,
    y: 80,
    frame: false,             // 无边框原生玻璃
    transparent: true,        // 背景透明穿透
    alwaysOnTop: true,        // 系统级绝对置顶
    skipTaskbar: false,       // 保持托盘常驻
    hasShadow: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadURL('http://localhost:3000'); // 或 dist/index.html
});`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative w-full max-w-2xl bg-white dark:bg-[#1C1C1E] rounded-[28px] shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden flex flex-col max-h-[88vh] z-10 text-zinc-900 dark:text-zinc-100"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between bg-zinc-50/70 dark:bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#007AFF]/10 text-[#007AFF] flex items-center justify-center shadow-xs">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-tight flex items-center gap-2">
                    <span>真实电脑运行机制与安装包生成</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#007AFF]/10 text-[#007AFF] font-semibold">
                      Native Desktop
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    解析真实桌面运行场景与打包为 Mac (.dmg) / Windows (.exe) 独立软件方案
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Segmented Switcher */}
            <div className="px-6 pt-4 pb-2 flex items-center gap-2">
              <button
                onClick={() => setActiveTab('concept')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'concept'
                    ? 'bg-[#007AFF] text-white shadow-xs'
                    : 'bg-black/[0.04] dark:bg-white/[0.06] text-zinc-600 dark:text-zinc-300 hover:bg-black/[0.08]'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>1. 真实电脑中的位置</span>
              </button>

              <button
                onClick={() => setActiveTab('tauri')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'tauri'
                    ? 'bg-[#007AFF] text-white shadow-xs'
                    : 'bg-black/[0.04] dark:bg-white/[0.06] text-zinc-600 dark:text-zinc-300 hover:bg-black/[0.08]'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>2. 推荐：Tauri 打包 (仅 10MB)</span>
              </button>

              <button
                onClick={() => setActiveTab('electron')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'electron'
                    ? 'bg-[#007AFF] text-white shadow-xs'
                    : 'bg-black/[0.04] dark:bg-white/[0.06] text-zinc-600 dark:text-zinc-300 hover:bg-black/[0.08]'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>3. Electron 方案</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4 overflow-y-auto space-y-4 flex-1 text-xs leading-relaxed select-text">
              {activeTab === 'concept' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40 space-y-2">
                    <div className="flex items-center gap-2 text-[#007AFF] font-bold text-sm">
                      <Sparkles className="w-4 h-4" />
                      <span>您的问题：真实电脑里后面的内容出现在哪里？</span>
                    </div>
                    <p className="text-zinc-700 dark:text-zinc-300">
                      **在真实电脑中，并没有后面的模拟网页！**
                      在打包成桌面端客户端后，后面的背景直接就是**您真实的操作系统桌面**与您正在使用的软件（例如：同花顺/Choice证券软件、PDF阅读器、Excel、财经网页或聊天窗口）。
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.08] space-y-2">
                      <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>原生桌面悬浮球（Always on Top）</span>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-400">
                        easyFinance 平时只作为系统托盘浮球，悬浮在屏幕右侧。无论切到任何桌面窗口，它都在最上层，零侵占、零打扰。
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.08] space-y-2">
                      <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#007AFF]" />
                        <span>研读屏幕工作台（按需独立新建）</span>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-400">
                        正如您所设想的：用户可以在悬浮窗内点击「新建/打开研读窗口」，才独立弹出内置的金融研读样本工作台，平常不占屏幕空间！
                      </p>
                    </div>
                  </div>

                  {/* Instant Demo Switcher Action */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        onClose();
                        onLaunchDesktopMode();
                      }}
                      className="w-full py-3 px-4 rounded-2xl bg-[#007AFF] hover:bg-[#0066d6] text-white font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
                    >
                      <Monitor className="w-4 h-4" />
                      <span>立刻体验：切换至「纯净桌面悬浮模式」（收起背景研读屏幕）</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'tauri' && (
                <div className="space-y-3">
                  <p className="text-zinc-600 dark:text-zinc-400">
                    **Tauri (推荐)** 是现代桌面端首选框架。采用 Rust 底层驱动，具有**极速启动、内存仅占用 25MB、安装包体积小于 10MB** 的特点，完美支持窗口透明（Transparent）与置顶（AlwaysOnTop）。
                  </p>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500">
                      <span>打包命令 (在项目终端执行)</span>
                      <button
                        onClick={() => handleCopy(TAURI_COMMANDS, 'tauri-cmd')}
                        className="flex items-center gap-1 text-[#007AFF] hover:underline"
                      >
                        {copiedCode === 'tauri-cmd' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCode === 'tauri-cmd' ? '已复制' : '复制命令'}</span>
                      </button>
                    </div>
                    <pre className="p-3 rounded-xl bg-zinc-900 text-zinc-200 font-mono text-[11px] overflow-x-auto">
                      {TAURI_COMMANDS}
                    </pre>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500">
                      <span>透明悬浮窗配置: src-tauri/tauri.conf.json</span>
                      <button
                        onClick={() => handleCopy(TAURI_CONF, 'tauri-conf')}
                        className="flex items-center gap-1 text-[#007AFF] hover:underline"
                      >
                        {copiedCode === 'tauri-conf' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCode === 'tauri-conf' ? '已复制' : '复制配置'}</span>
                      </button>
                    </div>
                    <pre className="p-3 rounded-xl bg-zinc-900 text-zinc-200 font-mono text-[11px] max-h-48 overflow-y-auto">
                      {TAURI_CONF}
                    </pre>
                  </div>
                </div>
              )}

              {activeTab === 'electron' && (
                <div className="space-y-3">
                  <p className="text-zinc-600 dark:text-zinc-400">
                    如果您熟悉 Node.js 生态，也可使用 **Electron**。通过设置 `frame: false` 与 `alwaysOnTop: true`，直接将当前的 React 代码运行为独立桌面悬浮窗。
                  </p>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500">
                      <span>Electron 核心入口 (main.js)</span>
                      <button
                        onClick={() => handleCopy(ELECTRON_SNIPPET, 'electron-code')}
                        className="flex items-center gap-1 text-[#007AFF] hover:underline"
                      >
                        {copiedCode === 'electron-code' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCode === 'electron-code' ? '已复制' : '复制配置'}</span>
                      </button>
                    </div>
                    <pre className="p-3 rounded-xl bg-zinc-900 text-zinc-200 font-mono text-[11px] max-h-60 overflow-y-auto">
                      {ELECTRON_SNIPPET}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between bg-zinc-50/70 dark:bg-white/[0.02]">
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>支持导出工程并在本机运行 `npm run build` 生成安装包</span>
              </div>

              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 font-semibold text-xs transition-colors"
              >
                我知道了
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

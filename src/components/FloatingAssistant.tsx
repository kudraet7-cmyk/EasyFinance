import React, { useState, useEffect, useRef } from 'react';
import { 
  Scan, MessageSquareText, Radio, Search, Send, X, 
  Volume2, VolumeX, Sparkles, Paperclip,
  Check, Minimize2, KeyRound, Globe, Eye, EyeOff,
  AlertCircle, ChevronRight, ShieldCheck, CornerDownLeft, GitFork,
  Crop, Download, Copy, Trash2, FileDown, FileText, ChevronDown, CheckCheck, ArrowDown,
  Sun, Moon, Layers, Cpu, Box, Monitor, AppWindow
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, ScreenContextData, FinancialBulletin, DictionaryItem, ExplanationMode } from '../types';
import { SAMPLE_BULLETINS, FINANCIAL_DICTIONARY } from '../data/financialKnowledge';
import { QuickDiagramView } from './QuickDiagramView';

interface FloatingAssistantProps {
  onCaptureScreen: () => ScreenContextData;
  onRequestAreaCrop?: () => void;
  initialScreenContext?: ScreenContextData | null;
  onSearchTerm: (term: string) => void;
  externalTriggerTerm?: string | null;
  isWorkspaceOpen?: boolean;
  onToggleWorkspace?: () => void;
  onOpenPackagingGuide?: () => void;
}

export type LanguageMode = 'zh' | 'en';

const I18N = {
  zh: {
    appTitle: 'easyFinance',
    modePlain: '白话通俗解释',
    modePro: '专业金融逻辑分析',
    tabChat: '问答',
    tabDiagram: '框图',
    tabNews: '快讯',
    tabLookup: '词典',
    screenLoaded: '已载入',
    screenPlaceholder: '未载入屏幕 (点击读取)',
    captureScreen: '读取全屏',
    captureArea: '选区截屏',
    areaHint: '可自定义截取屏幕大小',
    recapture: '重读',
    scanning: '正在扫描屏幕...',
    clearScreen: '清除屏幕',
    screenContextBadge: '屏幕上下文',
    sendPlaceholder: '输入问题...',
    sendPlaceholderEmpty: '输入问题或读取屏幕...',
    aiThinking: '分析中...',
    playAudio: '朗读',
    stopAudio: '停止',
    aiDeconstruct: '深度拆解',
    searchPlaceholder: '搜索金融术语 (如: MACD, 年化利率)...',
    noTermsFound: '未找到相关术语，可切换至「问答」直接发问',
    disclaimer: '仅供客观参考 · 不构成投资建议',
    apiKeyBtn: 'API 密钥',
    apiKeyTitle: '配置 Gemini API 密钥',
    apiKeyDesc: '输入私有 Google Gemini API Key 以使用专属配额。留空则使用默认共享配额。',
    keyPlaceholder: '输入 Gemini API 密钥 (AIzaSy...)',
    saveKey: '保存配置',
    testKey: '测试连接',
    testing: '测试中...',
    clearKey: '恢复默认',
    keySaved: '密钥已保存',
    keyCleared: '已恢复默认密钥',
    keyValid: '连接成功！密钥有效',
    keyInvalid: '测试失败，请检查密钥',
    customKeyActive: '专属配额',
    defaultKeyActive: '在线',
    welcome: '我是 easyFinance，专注于屏幕财报、指标与费率的客观解析。\n支持随时在上方切换「白话通俗解释」与「专业金融逻辑分析」。',
    quickPrompts: [
      '计提公式',
      '核心逻辑',
      '真实IRR',
      'K线四要素'
    ],
    quickPromptsNoScreen: [
      'MACD公式',
      '真实IRR',
      'K线四要素',
      '市盈率PE'
    ],
    newsHeader: '客观财经快讯',
    newsSub: '宏观统计与公开数据',
    exportNotes: '导出记录',
    exportTitle: '导出解析记录',
    exportMarkdown: 'Markdown 格式 (.md)',
    exportMarkdownDesc: '支持排版与代码公式，适合导入 Obsidian/Notion',
    exportText: '纯文本格式 (.txt)',
    exportTextDesc: '轻量通用，纯文本易读与跨设备传输',
    copyAllMarkdown: '复制全篇 Markdown',
    copyAllMarkdownDesc: '一键将所有解析复制到系统剪贴板',
    copiedSuccess: '已复制到剪贴板！',
    exportSuccess: '记录已成功导出至本地文件',
    clearHistory: '清空会话',
    clearConfirm: '确定要清空当前的问答记录吗？',
    copyMessage: '复制',
    copied: '已复制',
    messageCount: (count: number) => `${count} 条解析记录`,
    glassThemeToggle: '玻璃质感切换',
    themeCrystalline: '极光透白水晶',
    themeObsidian: '深空曜石全息',
    hudTelemetry: '全息光感识别',
    fpsLabel: '60 FPS',
  },
  en: {
    appTitle: 'easyFinance',
    modePlain: 'Plain Language',
    modePro: 'Professional Logic',
    tabChat: 'Chat',
    tabDiagram: 'Diagram',
    tabNews: 'News',
    tabLookup: 'Dictionary',
    screenLoaded: 'Loaded',
    screenPlaceholder: 'No screen (Click capture)',
    captureScreen: 'Full Screen',
    captureArea: 'Crop Area',
    areaHint: 'Custom snipping area size',
    recapture: 'Recapture',
    scanning: 'Scanning screen...',
    clearScreen: 'Clear Screen',
    screenContextBadge: 'Screen Context',
    sendPlaceholder: 'Ask a question...',
    sendPlaceholderEmpty: 'Ask a question or capture screen...',
    aiThinking: 'Thinking...',
    playAudio: 'Read',
    stopAudio: 'Stop',
    aiDeconstruct: 'Deconstruct',
    searchPlaceholder: 'Search financial terms (e.g., MACD, IRR)...',
    noTermsFound: 'No matching terms. Switch to Chat to ask AI directly.',
    disclaimer: 'For reference only · Not investment advice',
    apiKeyBtn: 'API Key',
    apiKeyTitle: 'Configure Gemini API Key',
    apiKeyDesc: 'Set your personal Gemini API Key for dedicated quota. Leave blank for default shared quota.',
    keyPlaceholder: 'Enter Gemini API Key (AIzaSy...)',
    saveKey: 'Save Key',
    testKey: 'Test',
    testing: 'Testing...',
    clearKey: 'Default',
    keySaved: 'Key saved successfully',
    keyCleared: 'Reverted to default key',
    keyValid: 'Connected! Key is valid',
    keyInvalid: 'Verification failed',
    customKeyActive: 'Pro Quota',
    defaultKeyActive: 'Active',
    welcome: 'I am easyFinance, deconstructing screen financial statements, metrics, and fees objectively.\nSwitch anytime above between Plain Language and Professional Logic.',
    quickPrompts: [
      'Fee Formula',
      'Core Logic',
      'True IRR',
      'Candlestick 4'
    ],
    quickPromptsNoScreen: [
      'MACD Formula',
      'True IRR',
      'Candlestick 4',
      'PE Ratio'
    ],
    newsHeader: 'Objective News',
    newsSub: 'Macro stats & public facts',
    exportNotes: 'Export',
    exportTitle: 'Export Analysis Notes',
    exportMarkdown: 'Markdown (.md)',
    exportMarkdownDesc: 'Structured formatting with equations for Notion/Obsidian',
    exportText: 'Plain Text (.txt)',
    exportTextDesc: 'Lightweight format for all devices and editors',
    copyAllMarkdown: 'Copy All as Markdown',
    copyAllMarkdownDesc: 'Copy entire analysis history to clipboard',
    copiedSuccess: 'Copied to clipboard!',
    exportSuccess: 'Saved to local file',
    clearHistory: 'Clear History',
    clearConfirm: 'Clear all chat messages?',
    copyMessage: 'Copy',
    copied: 'Copied',
    messageCount: (count: number) => `${count} messages`,
    glassThemeToggle: 'Glass Atmosphere',
    themeCrystalline: 'Crystalline Glass (Light)',
    themeObsidian: 'Obsidian HUD Glass (Dark)',
    hudTelemetry: 'Holographic Optical Active',
    fpsLabel: '60 FPS',
  }
};

export const FloatingAssistant: React.FC<FloatingAssistantProps> = ({
  onCaptureScreen,
  onRequestAreaCrop,
  initialScreenContext,
  onSearchTerm,
  externalTriggerTerm,
  isWorkspaceOpen = true,
  onToggleWorkspace,
  onOpenPackagingGuide
}) => {
  // Bilingual State
  const [language, setLanguage] = useState<LanguageMode>(() => {
    return (localStorage.getItem('easyfinance_lang') as LanguageMode) || 'zh';
  });
  const t = I18N[language];

  // Futuristic Glass Atmosphere State (Crystalline Light vs Obsidian Dark HUD)
  const [glassTheme, setGlassTheme] = useState<'crystalline' | 'obsidian'>(() => {
    const saved = localStorage.getItem('ef_glass_theme');
    return saved === 'obsidian' ? 'obsidian' : 'crystalline';
  });

  const handleToggleGlassTheme = () => {
    const next = glassTheme === 'crystalline' ? 'obsidian' : 'crystalline';
    setGlassTheme(next);
    localStorage.setItem('ef_glass_theme', next);
    showToast(next === 'obsidian' 
      ? (language === 'zh' ? '已切换至曜石全息深空玻璃' : 'Switched to Obsidian Dark HUD Glass') 
      : (language === 'zh' ? '已切换至极光水晶透白玻璃' : 'Switched to Crystalline Light Glass')
    );
  };

  const handleToggleLanguage = () => {
    const nextLang = language === 'zh' ? 'en' : 'zh';
    setLanguage(nextLang);
    localStorage.setItem('easyfinance_lang', nextLang);
  };

  // Custom API Key Configuration State
  const [userApiKey, setUserApiKey] = useState<string>(() => {
    return localStorage.getItem('easyfinance_custom_api_key') || '';
  });
  const [tempApiKey, setTempApiKey] = useState<string>(userApiKey);
  const [showKeyPassword, setShowKeyPassword] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isVerifyingKey, setIsVerifyingKey] = useState<boolean>(false);
  const [verifyMessage, setVerifyMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Widget Open/Min State
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'diagram' | 'news' | 'lookup'>('chat');
  
  // Explanation Mode: 'plain' (白话通俗解释) vs 'professional' (专业金融逻辑分析)
  const [explanationMode, setExplanationMode] = useState<ExplanationMode>(() => {
    return (localStorage.getItem('easyfinance_mode') as ExplanationMode) || 'plain';
  });

  const handleModeChange = (mode: ExplanationMode) => {
    setExplanationMode(mode);
    localStorage.setItem('easyfinance_mode', mode);
  };
  
  // Position State (Draggable)
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 28, y: 112 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({
    startX: 0, startY: 0, initialX: 28, initialY: 112
  });
  const hasDraggedRef = useRef<boolean>(false);
  const pointerStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Screen Context state
  const [screenContext, setScreenContext] = useState<ScreenContextData | null>(null);
  const [isScanningScreen, setIsScanningScreen] = useState<boolean>(false);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: t.welcome,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: 'plain'
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoadingReply, setIsLoadingReply] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update welcome message if language changes and only welcome exists
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'welcome') {
        return [{
          id: 'welcome',
          role: 'assistant',
          text: t.welcome,
          timestamp: prev[0].timestamp,
          mode: explanationMode
        }];
      }
      return prev;
    });
  }, [language]);

  // News State
  const [bulletins] = useState<FinancialBulletin[]>(SAMPLE_BULLETINS);
  const [currentNewsIndex, setCurrentNewsIndex] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeSpeakingText, setActiveSpeakingText] = useState<string | null>(null);

  // Lookup State
  const [searchWord, setSearchWord] = useState<string>('');

  // Export, Copy & Chat Utilities
  const [isExportMenuOpen, setIsExportMenuOpen] = useState<boolean>(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isScrolledUp, setIsScrolledUp] = useState<boolean>(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2200);
  };

  // Close export menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    if (isExportMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isExportMenuOpen]);

  const handleCopyMessage = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMsgId(id);
      showToast(t.copiedSuccess);
      setTimeout(() => {
        setCopiedMsgId((prev) => (prev === id ? null : prev));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy message text', err);
    }
  };

  const handleClearHistory = () => {
    if (messages.length <= 1 && messages[0]?.id === 'welcome') {
      return;
    }
    if (window.confirm(t.clearConfirm)) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          text: t.welcome,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mode: explanationMode
        }
      ]);
      showToast(language === 'zh' ? '会话记录已重置' : 'History cleared');
    }
  };

  const generateExportContent = (format: 'markdown' | 'text'): string => {
    const now = new Date();
    const dateStr = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0') + ' ' +
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0') + ':' +
      String(now.getSeconds()).padStart(2, '0');

    const modeLabel = explanationMode === 'plain' ? t.modePlain : t.modePro;
    const screenTitle = screenContext?.title || (language === 'zh' ? '无关联屏幕' : 'None');

    if (format === 'markdown') {
      let md = `# easyFinance 智能金融解析记录\n\n`;
      md += `> 极简金融信息悬浮解析 · 客观数理与条款拆解记录\n\n`;
      md += `- **导出时间**：\`${dateStr}\`\n`;
      md += `- **当前解释模式**：**${modeLabel}**\n`;
      md += `- **屏幕上下文**：${screenTitle} ${screenContext?.source ? `(${screenContext.source})` : ''}\n`;
      if (screenContext?.areaDimensions) {
        md += `- **选区尺寸**：\`${screenContext.areaDimensions.width} × ${screenContext.areaDimensions.height} px\`\n`;
      }
      if (screenContext?.text) {
        md += `\n<details>\n<summary><b>点击展开关联屏幕文字切片</b></summary>\n\n\`\`\`text\n${screenContext.text.trim()}\n\`\`\`\n</details>\n`;
      }
      md += `\n---\n\n## 问答与解析明细\n\n`;

      messages.forEach((msg, idx) => {
        if (msg.role === 'user') {
          md += `### 💬 问题 #${idx + 1} (${msg.timestamp})\n\n`;
          md += `> ${msg.text.split('\n').join('\n> ')}\n\n`;
        } else {
          const modeTag = msg.mode === 'professional' ? '【专业金融逻辑】' : '【白话通俗解释】';
          md += `#### 🤖 easyFinance 解答 ${msg.mode ? modeTag : ''} (${msg.timestamp})\n\n`;
          md += `${msg.text}\n\n`;
        }
      });

      md += `---\n\n*声明：本记录由 easyFinance 客观分析生成，仅供参考，不构成任何投资建议或财务审计背书。*\n`;
      return md;
    } else {
      let txt = `==================================================\n`;
      txt += `easyFinance 智能金融解析记录\n`;
      txt += `==================================================\n`;
      txt += `导出时间: ${dateStr}\n`;
      txt += `当前模式: ${modeLabel}\n`;
      txt += `屏幕上下文: ${screenTitle}\n`;
      if (screenContext?.areaDimensions) {
        txt += `选区尺寸: ${screenContext.areaDimensions.width} x ${screenContext.areaDimensions.height} px\n`;
      }
      txt += `==================================================\n\n`;

      messages.forEach((msg, idx) => {
        const roleLabel = msg.role === 'user' ? '【用户提问】' : '【easyFinance 解答】';
        const modeTag = msg.mode ? ` [${msg.mode === 'professional' ? '专业逻辑' : '白话通俗'}]` : '';
        txt += `[#${idx + 1}] ${roleLabel}${modeTag} (${msg.timestamp})\n`;
        txt += `${msg.text}\n\n`;
        txt += `--------------------------------------------------\n`;
      });

      txt += `\n仅供客观参考 · 不构成投资建议\n`;
      return txt;
    }
  };

  const handleDownloadFile = (format: 'markdown' | 'text') => {
    const content = generateExportContent(format);
    const ext = format === 'markdown' ? 'md' : 'txt';
    const mime = format === 'markdown' ? 'text/markdown;charset=utf-8' : 'text/plain;charset=utf-8';
    const now = new Date();
    const dateStamp = now.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStamp = now.toTimeString().slice(0, 8).replace(/:/g, '');
    const filename = `easyFinance_Records_${dateStamp}_${timeStamp}.${ext}`;

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsExportMenuOpen(false);
    showToast(t.exportSuccess);
  };

  const handleCopyAllAsMarkdown = async () => {
    const content = generateExportContent('markdown');
    try {
      await navigator.clipboard.writeText(content);
      setIsExportMenuOpen(false);
      showToast(t.copiedSuccess);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  // Handle external trigger term (e.g. from selecting text in document)
  useEffect(() => {
    if (externalTriggerTerm) {
      setIsOpen(true);
      setActiveTab('chat');
      const ctx = onCaptureScreen();
      setScreenContext(ctx);
      const queryText = language === 'en'
        ? `Please deconstruct and explain the definition and mathematical principles of: ${externalTriggerTerm}`
        : `请拆解并翻译这个词的定义与计算原理：${externalTriggerTerm}`;
      handleSendMessage(queryText, ctx);
    }
  }, [externalTriggerTerm]);

  // Handle external area snipping / screen update
  useEffect(() => {
    if (initialScreenContext) {
      setScreenContext(initialScreenContext);
      setIsOpen(true);
      setActiveTab('chat');
      const areaInfo = initialScreenContext.areaDimensions
        ? `[${initialScreenContext.areaDimensions.width}×${initialScreenContext.areaDimensions.height}px]`
        : '';
      const prompt = language === 'en'
        ? `I have captured this screen area ${areaInfo}. Please deconstruct the key terms and financial formulas.`
        : `已成功截取屏幕区域 ${areaInfo}。请深度拆解其中的核心条款与数理逻辑。`;
      handleSendMessage(prompt, initialScreenContext);
    }
  }, [initialScreenContext]);

  // Read screen action
  const handleReadScreenAction = () => {
    setIsScanningScreen(true);
    setTimeout(() => {
      const captured = onCaptureScreen();
      setScreenContext(captured);
      setIsScanningScreen(false);
      
      const scanNoticeMsg: ChatMessage = {
        id: `scan-${Date.now()}`,
        role: 'assistant',
        text: language === 'en'
          ? `Captured screen: "${captured.title}" (extracted ~${captured.text.length} chars).\nYou can directly ask about specific figures, calculation rules, or terms on the screen.`
          : `已读取屏幕内容：「${captured.title}」（提取约 ${captured.text.length} 字）。\n您可以直接提问屏幕上的具体数字、计算逻辑或晦涩条款，例如：\n• "解释屏幕里的管理费计提公式与真实扣除方式"\n• "拆解屏幕中K线的开高低收几何四要素"\n• "用大白话总结这段合同的实际资金成本"`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hasScreenContext: true
      };
      setMessages((prev) => [...prev, scanNoticeMsg]);
    }, 400);
  };

  // Verify and Save Custom API Key
  const handleTestKey = async () => {
    if (!tempApiKey.trim()) {
      setVerifyMessage({ type: 'info', text: language === 'en' ? 'Key is empty. Will use shared default key.' : '未输入密钥，将使用系统共享密钥。' });
      return;
    }
    setIsVerifyingKey(true);
    setVerifyMessage(null);
    try {
      const res = await fetch('/api/verify-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: tempApiKey.trim() })
      });
      const data = await res.json();
      if (data.valid) {
        setVerifyMessage({ type: 'success', text: t.keyValid });
      } else {
        setVerifyMessage({ type: 'error', text: `${t.keyInvalid}: ${data.message || ''}` });
      }
    } catch (err: any) {
      setVerifyMessage({ type: 'error', text: t.keyInvalid });
    } finally {
      setIsVerifyingKey(false);
    }
  };

  const handleSaveKey = () => {
    const cleanKey = tempApiKey.trim();
    setUserApiKey(cleanKey);
    if (cleanKey) {
      localStorage.setItem('easyfinance_custom_api_key', cleanKey);
      setVerifyMessage({ type: 'success', text: t.keySaved });
    } else {
      localStorage.removeItem('easyfinance_custom_api_key');
      setVerifyMessage({ type: 'info', text: t.keyCleared });
    }
    setTimeout(() => {
      setIsSettingsOpen(false);
      setVerifyMessage(null);
    }, 1000);
  };

  const handleClearKey = () => {
    setTempApiKey('');
    setUserApiKey('');
    localStorage.removeItem('easyfinance_custom_api_key');
    setVerifyMessage({ type: 'info', text: t.keyCleared });
  };

  // Send Chat Message
  const handleSendMessage = async (textToSend?: string, contextOverride?: ScreenContextData | null) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoadingReply) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hasScreenContext: Boolean(contextOverride || screenContext)
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoadingReply(true);

    try {
      const ctx = contextOverride !== undefined ? contextOverride : screenContext;
      const historyPayload = messages
        .filter((m) => m.id !== 'welcome')
        .concat(userMsg)
        .map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          text: m.text
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(userApiKey.trim() ? { 'x-gemini-api-key': userApiKey.trim() } : {})
        },
        body: JSON.stringify({
          messages: historyPayload,
          screenContext: ctx ? `【Title / 标题】${ctx.title}\n【Content / 正文】${ctx.text}` : undefined,
          apiKey: userApiKey.trim() || undefined,
          language: language,
          mode: explanationMode
        })
      });

      const data = await res.json();
      if (data.success && data.reply) {
        const assistantMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          hasScreenContext: Boolean(ctx),
          mode: explanationMode
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error('API reply error');
      }
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        text: explanationMode === 'professional'
          ? (language === 'en'
              ? `[Professional Logic Analysis] Regarding "${text}": Focus on quantitative accrual rules, regulatory disclosure baselines, and discounted cash flow mechanics.`
              : `【专业金融逻辑分析】关于 "${text}"：建议从会计计提准则、现金流折现与数理逻辑进行客观推演。`)
          : (language === 'en'
              ? `[Plain Explanation] Regarding "${text}": In plain words, look past the financial buzzwords to see what the numbers actually cost you in reality.`
              : `【白话通俗解释】关于 "${text}"：简单来说，就是看穿各种高大上的专业词汇，算清每一分钱真实的扣除与支出。`),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: explanationMode
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoadingReply(false);
    }
  };

  // Text-to-speech
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isSpeaking && activeSpeakingText === text) {
      setIsSpeaking(false);
      setActiveSpeakingText(null);
      return;
    }

    const clean = text.replace(/[*#`_•]/g, '');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = language === 'en' ? 'en-US' : 'zh-CN';
    utterance.rate = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setActiveSpeakingText(text);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setActiveSpeakingText(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setActiveSpeakingText(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Dragging logic
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.no-drag')) return;
    setIsDragging(true);
    hasDraggedRef.current = false;
    pointerStartPosRef.current = { x: e.clientX, y: e.clientY };
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
    const distance = Math.hypot(
      e.clientX - pointerStartPosRef.current.x,
      e.clientY - pointerStartPosRef.current.y
    );
    if (distance > 4) {
      hasDraggedRef.current = true;
    }

    const deltaX = dragStartRef.current.startX - e.clientX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    const maxX = window.innerWidth - (isOpen ? 440 : 130);
    const maxY = window.innerHeight - (isOpen ? 620 : 90);

    const newX = Math.max(16, Math.min(Math.max(16, maxX), dragStartRef.current.initialX + deltaX));
    const newY = Math.max(104, Math.min(Math.max(104, maxY), dragStartRef.current.initialY + deltaY));

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    // Keep hasDraggedRef active briefly so the upcoming click event is suppressed
    if (hasDraggedRef.current) {
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 160);
    }
  };

  const handleCollapsedOrbClick = (e: React.MouseEvent) => {
    // If the user was dragging to reposition the orb, do NOT open the window
    if (hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    setIsOpen(true);
  };

  return (
    <div
      id="easyfinance-floating-root"
      className="fixed z-50 select-none font-sans"
      style={{ right: `${position.x}px`, top: `${position.y}px` }}
    >
      <AnimatePresence mode="wait">
        {/* 1. COLLAPSED FLOATING AEROGEL GLASS ORB with levitation & specular sheen */}
        {!isOpen && (
          <motion.div
            key="collapsed-pill"
            initial={{ opacity: 0, scale: 0.86, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.86, y: 8 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.8 }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="flex items-center gap-2 group cursor-grab active:cursor-grabbing select-none"
          >
            <button
              onClick={handleCollapsedOrbClick}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-[24px] ${
                glassTheme === 'obsidian'
                  ? 'futuristic-glass-dark text-white hover:shadow-[0_12px_40px_rgba(0,122,255,0.4)]'
                  : 'futuristic-glass-light text-[#1C1C1E] hover:shadow-[0_12px_40px_rgba(0,122,255,0.22)]'
              } transition-all duration-300 group-hover:scale-[1.03] group-active:scale-95`}
              title="easyFinance Futuristic Glass HUD"
            >
              {/* Optical Glass Specular Sheen Reflection */}
              <div className="absolute inset-0 rounded-[24px] pointer-events-none glass-specular-sheen opacity-80" />

              {/* Holographic Glowing Glass Core Orb */}
              <div className="relative w-7 h-7 rounded-[12px] bg-gradient-to-br from-[#007AFF] via-[#0055D4] to-[#003B99] text-white flex items-center justify-center text-xs font-bold shadow-[0_4px_14px_rgba(0,122,255,0.45)] ring-1 ring-white/50 shrink-0">
                <span className="font-mono tracking-tighter">eF</span>
                {/* Laser ring pulse */}
                <span className="absolute -inset-1 rounded-[16px] border border-[#007AFF]/40 animate-pulse-ring pointer-events-none" />
              </div>

              <div className="text-left relative z-10">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold leading-none tracking-tight">
                    easyFinance
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-[#007AFF]/15 text-[#007AFF] font-semibold">
                    HUD
                  </span>
                </div>
                <div className="text-[10px] opacity-75 mt-1 font-medium font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  <span>{language === 'en' ? 'Spatial Glass · Open' : '全息空间玻璃 · 展开'}</span>
                </div>
              </div>
            </button>
          </motion.div>
        )}

        {/* 2. EXPANDED FUTURISTIC OPTICAL GLASS WINDOW */}
        {isOpen && (
          <motion.div
            key="expanded-window"
            id="easyfinance-floating-window"
            initial={{ opacity: 0, scale: 0.94, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -8 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28, mass: 0.8 }}
            className={`w-[370px] sm:w-[420px] h-[605px] rounded-[28px] ${
              glassTheme === 'obsidian'
                ? 'futuristic-glass-dark text-zinc-100 shadow-[0_28px_80px_rgba(0,0,0,0.8),0_0_40px_rgba(0,122,255,0.22)]'
                : 'futuristic-glass-light text-[#1C1C1E] shadow-[0_28px_70px_rgba(15,23,42,0.18),0_10px_36px_rgba(0,122,255,0.14)]'
            } flex flex-col overflow-hidden relative transition-colors duration-300`}
            style={{
              WebkitBackdropFilter: glassTheme === 'obsidian' ? 'blur(40px) saturate(200%)' : 'blur(36px) saturate(190%)'
            }}
          >
            {/* Top Curved Optical Glass Specular Sheen (Physics Simulation) */}
            <div 
              className={`absolute top-0 left-0 right-0 h-32 pointer-events-none rounded-t-[28px] ${
                glassTheme === 'obsidian' ? 'glass-specular-sheen-dark' : 'glass-specular-sheen'
              }`} 
            />

            {/* Futuristic HUD Corner Telemetry Ticks */}
            <div className="absolute top-2 left-3 text-[8px] font-mono select-none pointer-events-none opacity-30 tracking-widest">
              ┌ 4K·OPTIC
            </div>
            <div className="absolute top-2 right-3 text-[8px] font-mono select-none pointer-events-none opacity-30 tracking-widest">
              HUD·v2.8 ┐
            </div>

            {/* Subtle Floating Toast */}
            <AnimatePresence>
              {toastMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-14 left-1/2 -translate-x-1/2 z-50 pointer-events-none px-3.5 py-1.5 rounded-full bg-[#1C1C1E]/90 backdrop-blur-md text-white text-xs font-medium shadow-lg flex items-center gap-1.5 whitespace-nowrap border border-white/20"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-[#34C759]" strokeWidth={2} />
                  <span>{toastMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Draggable Futuristic Glass Window Header */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="px-4 pt-3.5 pb-2 flex items-center justify-between cursor-grab active:cursor-grabbing select-none relative z-10"
          >
            <div className="flex items-center gap-2.5">
              {/* Interactive Traffic Lights Jewel Dots */}
              <div className="flex items-center gap-1.5 mr-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]/60 inline-block shadow-xs hover:opacity-80 transition-opacity"
                  title={language === 'en' ? 'Close HUD' : '收起至边缘悬浮球'}
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]/60 inline-block shadow-xs hover:opacity-80 transition-opacity"
                  title={language === 'en' ? 'Minimize' : '最小化'}
                />
                <button
                  onClick={onToggleWorkspace}
                  className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]/60 inline-block shadow-xs hover:opacity-80 transition-opacity"
                  title={isWorkspaceOpen ? (language === 'en' ? 'Hide Workspace' : '收起研读屏幕') : (language === 'en' ? 'Open Workspace' : '展开研读屏幕窗口')}
                />
              </div>

              {/* Futuristic App Title & Telemetry */}
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight">
                  {t.appTitle}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#007AFF] animate-pulse" />
                <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded-full ${
                  glassTheme === 'obsidian' ? 'bg-cyan-500/15 text-cyan-300' : 'bg-[#E5F0FF] text-[#007AFF]'
                }`}>
                  {t.fpsLabel}
                </span>
                {userApiKey && (
                  <span className="text-[9px] font-semibold text-emerald-500 px-1.5 py-0.2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    Pro
                  </span>
                )}
              </div>
            </div>

            {/* Window Chrome Controls: Clean, Uncrowded & Spacious */}
            <div className="no-drag flex items-center gap-1.5 text-[#8E8E93]">
              {/* Futuristic Glass Theme Switcher (Crystalline vs Obsidian) */}
              <button
                onClick={handleToggleGlassTheme}
                className={`p-1.5 rounded-[9px] transition-all flex items-center gap-1 ${
                  glassTheme === 'obsidian'
                    ? 'text-amber-300 bg-white/10 hover:bg-white/20 border border-white/15'
                    : 'text-[#007AFF] bg-white/70 hover:bg-white border border-black/[0.04] shadow-xs'
                }`}
                title={glassTheme === 'obsidian' ? t.themeObsidian : t.themeCrystalline}
              >
                {glassTheme === 'obsidian' ? (
                  <Moon className="w-3.5 h-3.5 text-amber-300" strokeWidth={2} />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-[#007AFF]" strokeWidth={2} />
                )}
              </button>

              {/* Bilingual Switcher */}
              <button
                onClick={handleToggleLanguage}
                className={`px-2 py-1 rounded-[9px] text-[11px] font-semibold transition-all flex items-center gap-1 ${
                  glassTheme === 'obsidian'
                    ? 'text-zinc-200 bg-white/10 hover:bg-white/20 border border-white/10'
                    : 'text-[#1C1C1E] bg-white/70 hover:bg-white border border-black/[0.04] shadow-xs'
                }`}
                title={language === 'zh' ? 'Switch to English' : '切换为中文'}
              >
                <Globe className="w-3 h-3 text-[#007AFF]" strokeWidth={1.75} />
                <span>{language === 'zh' ? 'EN' : '中'}</span>
              </button>

              {/* API Key Entry Button */}
              <button
                onClick={() => {
                  setTempApiKey(userApiKey);
                  setIsSettingsOpen(!isSettingsOpen);
                  setVerifyMessage(null);
                }}
                className={`p-1.5 rounded-[9px] transition-all ${
                  isSettingsOpen || userApiKey 
                    ? 'text-[#007AFF] bg-[#007AFF]/15' 
                    : glassTheme === 'obsidian'
                    ? 'text-zinc-400 hover:text-white hover:bg-white/10'
                    : 'text-[#8E8E93] hover:text-[#1C1C1E] hover:bg-white/70'
                }`}
                title={t.apiKeyTitle}
              >
                <KeyRound className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>

              {/* Minimize Window */}
              <button
                onClick={() => setIsOpen(false)}
                className={`p-1.5 rounded-[9px] transition-all ${
                  glassTheme === 'obsidian'
                    ? 'text-zinc-400 hover:text-white hover:bg-white/10'
                    : 'text-[#8E8E93] hover:text-[#1C1C1E] hover:bg-white/70'
                }`}
                title={language === 'en' ? 'Minimize' : '最小化'}
              >
                <Minimize2 className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          {/* Dedicated Companion Workspace Bar (研读工作台联动胶囊 - 极简独立设计，拒绝拥挤) */}
          {onToggleWorkspace && (
            <div className="no-drag px-4 pb-2.5 relative z-10">
              <div
                className={`flex items-center justify-between px-3 py-2 rounded-[18px] transition-all border ${
                  !isWorkspaceOpen
                    ? glassTheme === 'obsidian'
                      ? 'bg-gradient-to-r from-blue-900/40 via-blue-950/30 to-black/40 border-blue-500/30 shadow-[0_4px_20px_rgba(0,122,255,0.15)]'
                      : 'bg-gradient-to-r from-blue-50/90 via-sky-50/70 to-white/80 border-blue-200/80 shadow-xs'
                    : glassTheme === 'obsidian'
                    ? 'bg-white/[0.04] border-white/10 hover:border-white/15'
                    : 'bg-black/[0.025] border-black/[0.05] hover:bg-black/[0.035]'
                }`}
              >
                {/* Left: Window State Telemetry */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-[11px] flex items-center justify-center shrink-0 transition-all ${
                      !isWorkspaceOpen
                        ? 'bg-[#007AFF] text-white shadow-sm ring-2 ring-[#007AFF]/20'
                        : glassTheme === 'obsidian'
                        ? 'bg-white/10 text-cyan-300'
                        : 'bg-[#007AFF]/10 text-[#007AFF]'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 leading-tight">
                      <span className="font-bold text-xs tracking-tight">
                        {language === 'en' ? 'Research Workspace' : '金融研读工作台'}
                      </span>
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isWorkspaceOpen
                            ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                            : 'bg-zinc-400'
                        }`}
                      />
                    </div>
                    <p
                      className={`text-[10px] mt-0.5 truncate ${
                        glassTheme === 'obsidian' ? 'text-zinc-400' : 'text-zinc-500'
                      }`}
                    >
                      {isWorkspaceOpen
                        ? language === 'en'
                          ? 'Active in background · Ready to capture'
                          : '后台运行中 · 可自由划词与截屏'
                        : language === 'en'
                        ? 'Collapsed · Pure Desktop HUD Mode'
                        : '已收起 · 当前为纯净桌面悬浮状态'}
                    </p>
                  </div>
                </div>

                {/* Right: Tactile Action Controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={onToggleWorkspace}
                    className={`px-3 py-1.5 rounded-[12px] text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                      !isWorkspaceOpen
                        ? 'bg-[#007AFF] hover:bg-[#0066d6] text-white shadow-sm shadow-[#007AFF]/30'
                        : glassTheme === 'obsidian'
                        ? 'bg-white/10 hover:bg-white/15 text-zinc-200 border border-white/10'
                        : 'bg-white hover:bg-zinc-50 text-zinc-700 border border-black/[0.08] shadow-2xs'
                    }`}
                    title={isWorkspaceOpen ? '收起研读屏幕，进入纯净桌面悬浮模式' : '新建/展开研读屏幕窗口'}
                  >
                    <AppWindow className="w-3.5 h-3.5 text-inherit" />
                    <span>
                      {isWorkspaceOpen
                        ? language === 'en' ? 'Collapse' : '收起窗口'
                        : language === 'en' ? 'New Window' : '新建窗口'}
                    </span>
                  </button>

                  {onOpenPackagingGuide && (
                    <button
                      onClick={onOpenPackagingGuide}
                      className={`p-1.5 rounded-[10px] transition-all ${
                        glassTheme === 'obsidian'
                          ? 'text-zinc-400 hover:text-white hover:bg-white/10'
                          : 'text-zinc-400 hover:text-zinc-700 hover:bg-black/5'
                      }`}
                      title="电脑独立安装包 (Tauri/Electron) 架构指南"
                    >
                      <Box className="w-3.5 h-3.5 text-[#007AFF]" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Top Mode Toggle Button: 白话通俗解释 vs 专业金融逻辑分析 */}
          <div className="no-drag px-4 pb-2 relative z-10">
            <div className={`flex items-center p-1 rounded-[16px] backdrop-blur-md border ${
              glassTheme === 'obsidian'
                ? 'bg-white/[0.06] border-white/10'
                : 'bg-black/[0.03] border-white/60'
            }`}>
              <button
                onClick={() => handleModeChange('plain')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-[12px] text-xs font-semibold transition-all ${
                  explanationMode === 'plain'
                    ? glassTheme === 'obsidian'
                      ? 'bg-white/20 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)] border border-cyan-400/30'
                      : 'bg-white text-[#007AFF] shadow-xs border border-black/[0.04]'
                    : glassTheme === 'obsidian'
                    ? 'text-zinc-400 hover:text-zinc-200'
                    : 'text-[#8E8E93] hover:text-[#1C1C1E]'
                }`}
                title={language === 'zh' ? '通俗大白话拆解' : 'Plain language explanation'}
              >
                <MessageSquareText className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span className="truncate">{t.modePlain}</span>
              </button>
              <button
                onClick={() => handleModeChange('professional')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-[12px] text-xs font-semibold transition-all ${
                  explanationMode === 'professional'
                    ? glassTheme === 'obsidian'
                      ? 'bg-white/20 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)] border border-cyan-400/30'
                      : 'bg-white text-[#007AFF] shadow-xs border border-black/[0.04]'
                    : glassTheme === 'obsidian'
                    ? 'text-zinc-400 hover:text-zinc-200'
                    : 'text-[#8E8E93] hover:text-[#1C1C1E]'
                }`}
                title={language === 'zh' ? '严谨数理公式与会计准则分析' : 'Professional financial logic analysis'}
              >
                <Sparkles className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span className="truncate">{t.modePro}</span>
              </button>
            </div>
          </div>

          {/* Quick Segmented Navigation Bar: 问答 | 框图 | 快讯 | 词典 */}
          <div className="no-drag px-4 pb-2 relative z-10">
            <div className={`flex items-center p-0.5 rounded-[14px] ${
              glassTheme === 'obsidian' ? 'bg-white/[0.04]' : 'bg-black/[0.03]'
            }`}>
              <button
                onClick={() => { setActiveTab('chat'); setIsSettingsOpen(false); }}
                className={`flex-1 flex items-center justify-center py-1 rounded-[10px] text-xs font-semibold transition-all ${
                  activeTab === 'chat' && !isSettingsOpen
                    ? glassTheme === 'obsidian'
                      ? 'bg-white/15 text-white shadow-xs'
                      : 'bg-white text-[#007AFF] shadow-xs'
                    : 'text-[#8E8E93] hover:text-[#1C1C1E]'
                }`}
              >
                <span>{t.tabChat}</span>
              </button>
              <button
                onClick={() => { setActiveTab('diagram'); setIsSettingsOpen(false); }}
                className={`flex-1 flex items-center justify-center py-1 rounded-[10px] text-xs font-semibold transition-all ${
                  activeTab === 'diagram' && !isSettingsOpen
                    ? glassTheme === 'obsidian'
                      ? 'bg-white/15 text-white shadow-xs'
                      : 'bg-white text-[#007AFF] shadow-xs'
                    : 'text-[#8E8E93] hover:text-[#1C1C1E]'
                }`}
              >
                <span>{t.tabDiagram}</span>
              </button>
              <button
                onClick={() => { setActiveTab('news'); setIsSettingsOpen(false); }}
                className={`flex-1 flex items-center justify-center py-1 rounded-[10px] text-xs font-semibold transition-all ${
                  activeTab === 'news' && !isSettingsOpen
                    ? glassTheme === 'obsidian'
                      ? 'bg-white/15 text-white shadow-xs'
                      : 'bg-white text-[#007AFF] shadow-xs'
                    : 'text-[#8E8E93] hover:text-[#1C1C1E]'
                }`}
              >
                <span>{t.tabNews}</span>
              </button>
              <button
                onClick={() => { setActiveTab('lookup'); setIsSettingsOpen(false); }}
                className={`flex-1 flex items-center justify-center py-1 rounded-[10px] text-xs font-semibold transition-all ${
                  activeTab === 'lookup' && !isSettingsOpen
                    ? glassTheme === 'obsidian'
                      ? 'bg-white/15 text-white shadow-xs'
                      : 'bg-white text-[#007AFF] shadow-xs'
                    : 'text-[#8E8E93] hover:text-[#1C1C1E]'
                }`}
              >
                <span>{t.tabLookup}</span>
              </button>
            </div>
          </div>

          {/* 3. SETTINGS SHEET (User Custom API Key Entry) */}
          {isSettingsOpen && (
            <div className={`no-drag absolute inset-0 z-40 ${
              glassTheme === 'obsidian'
                ? 'bg-zinc-950/90 text-zinc-100'
                : 'bg-white/85 text-[#1C1C1E]'
            } backdrop-blur-2xl px-5 py-4 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-150 rounded-[28px]`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold tracking-tight">
                      {t.apiKeyTitle}
                    </h3>
                    <p className={`text-[11px] mt-0.5 ${glassTheme === 'obsidian' ? 'text-zinc-400' : 'text-[#8E8E93]'}`}>
                      {t.apiKeyDesc}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    className={`p-1 rounded-[8px] transition-colors ${
                      glassTheme === 'obsidian' ? 'text-zinc-400 hover:text-white hover:bg-white/10' : 'text-[#8E8E93] hover:text-[#1C1C1E] hover:bg-black/5'
                    }`}
                  >
                    <X className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                </div>

                {/* Status Card */}
                <div className={`p-3 rounded-[16px] text-xs flex items-center justify-between border ${
                  userApiKey 
                    ? glassTheme === 'obsidian'
                      ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                      : 'bg-[#E5F0FF] border-[#007AFF]/20 text-[#007AFF]'
                    : glassTheme === 'obsidian'
                    ? 'bg-white/5 border-white/10 text-zinc-400'
                    : 'bg-black/[0.03] border-black/5 text-[#8E8E93]'
                }`}>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#007AFF]" strokeWidth={1.75} />
                    <span className="font-semibold text-[11px]">
                      {userApiKey ? t.customKeyActive : t.defaultKeyActive}
                    </span>
                  </div>
                  {userApiKey && (
                    <button
                      onClick={handleClearKey}
                      className="text-[11px] text-[#8E8E93] hover:text-red-500 font-medium transition-colors"
                    >
                      {t.clearKey}
                    </button>
                  )}
                </div>

                {/* Input with Mask Toggle */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold">
                    Google Gemini API Key
                  </label>
                  <div className="relative">
                    <input
                      type={showKeyPassword ? 'text' : 'password'}
                      value={tempApiKey}
                      onChange={(e) => setTempApiKey(e.target.value)}
                      placeholder={t.keyPlaceholder}
                      className={`w-full px-3.5 py-2.5 pr-10 rounded-[14px] text-xs outline-none border transition-all ${
                        glassTheme === 'obsidian'
                          ? 'bg-white/10 border-white/15 text-white placeholder:text-zinc-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
                          : 'bg-white text-[#1C1C1E] border-black/10 focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/15 shadow-xs'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowKeyPassword(!showKeyPassword)}
                      className={`absolute right-3 top-2.5 ${glassTheme === 'obsidian' ? 'text-zinc-400 hover:text-white' : 'text-[#8E8E93] hover:text-[#1C1C1E]'}`}
                    >
                      {showKeyPassword ? (
                        <EyeOff className="w-4 h-4" strokeWidth={1.75} />
                      ) : (
                        <Eye className="w-4 h-4" strokeWidth={1.75} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Verification Feedback */}
                {verifyMessage && (
                  <div className={`p-2.5 rounded-[12px] text-xs flex items-center gap-2 ${
                    verifyMessage.type === 'success' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : verifyMessage.type === 'error'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {verifyMessage.type === 'success' ? (
                      <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
                    )}
                    <span className="text-[11px] font-medium leading-tight">{verifyMessage.text}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTestKey}
                    disabled={isVerifyingKey}
                    className={`flex-1 py-2.5 rounded-[14px] text-xs font-semibold border transition-all disabled:opacity-50 active:scale-[0.98] ${
                      glassTheme === 'obsidian'
                        ? 'bg-white/10 text-white border-white/15 hover:bg-white/15'
                        : 'bg-white text-[#1C1C1E] border-black/10 hover:bg-black/[0.02]'
                    }`}
                  >
                    {isVerifyingKey ? t.testing : t.testKey}
                  </button>
                  <button
                    onClick={handleSaveKey}
                    className="flex-1 py-2.5 rounded-[14px] text-xs font-semibold bg-[#007AFF] text-white shadow-[0_4px_16px_rgba(0,122,255,0.35)] hover:bg-[#0066d6] active:scale-[0.98] transition-all"
                  >
                    {t.saveKey}
                  </button>
                </div>
                <p className={`text-[10px] text-center ${glassTheme === 'obsidian' ? 'text-zinc-500' : 'text-[#8E8E93]'}`}>
                  {language === 'en' 
                    ? 'Keys are stored strictly in your local browser storage.' 
                    : '密钥仅保存在您的本地浏览器中，用于向 Gemini 发起分析请求。'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 1: CHAT MODE (Primary) */}
          {activeTab === 'chat' && !isSettingsOpen && (
            <div className="no-drag flex-1 flex flex-col min-h-0">
              {/* Screen Read Trigger Card with Futuristic Optical HUD Glow */}
              <div className={`mx-4 mb-2 p-2.5 rounded-[20px] backdrop-blur-xl border transition-all ${
                glassTheme === 'obsidian'
                  ? 'bg-white/[0.05] border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
                  : 'bg-white/80 border-white/80 shadow-[0_4px_16px_rgba(0,122,255,0.06)]'
              } flex flex-col gap-2`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className={`w-7 h-7 rounded-[10px] flex items-center justify-center shrink-0 ${
                      glassTheme === 'obsidian'
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/25'
                        : 'bg-[#E5F0FF] text-[#007AFF]'
                    }`}>
                      {screenContext?.captureType === 'area' ? (
                        <Crop className="w-3.5 h-3.5" strokeWidth={2} />
                      ) : (
                        <Scan className={`w-3.5 h-3.5 ${isScanningScreen ? 'animate-spin' : ''}`} strokeWidth={1.75} />
                      )}
                    </div>
                    <div className="truncate">
                      {screenContext ? (
                        <div className="flex items-center gap-1.5 text-xs font-bold truncate">
                          <span className="truncate">{screenContext.title}</span>
                          {screenContext.areaDimensions && (
                            <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono shrink-0 ${
                              glassTheme === 'obsidian'
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                : 'bg-[#E5F0FF] text-[#007AFF]'
                            }`}>
                              {screenContext.areaDimensions.width}×{screenContext.areaDimensions.height}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className={`text-[11px] font-medium truncate ${
                          glassTheme === 'obsidian' ? 'text-zinc-400' : 'text-[#8E8E93]'
                        }`}>
                          {t.screenPlaceholder}
                        </div>
                      )}
                    </div>
                  </div>

                  {screenContext && (
                    <button
                      onClick={() => setScreenContext(null)}
                      className={`p-1 rounded-[8px] transition-colors ${
                        glassTheme === 'obsidian' ? 'text-zinc-400 hover:text-white' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
                      }`}
                      title={t.clearScreen}
                    >
                      <X className="w-3.5 h-3.5" strokeWidth={1.75} />
                    </button>
                  )}
                </div>

                {/* Capture Action Controls: Full Screen + Custom Area */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  <button
                    onClick={handleReadScreenAction}
                    disabled={isScanningScreen}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-[12px] text-xs font-semibold bg-[#007AFF] text-white shadow-[0_2px_10px_rgba(0,122,255,0.3)] hover:bg-[#0066d6] active:scale-[0.98] transition-all disabled:opacity-50"
                    title={language === 'en' ? 'Capture entire active screen' : '捕获当前完整屏幕页面'}
                  >
                    <Scan className="w-3 h-3" strokeWidth={1.75} />
                    <span>{screenContext && screenContext.captureType !== 'area' ? t.recapture : t.captureScreen}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onRequestAreaCrop) {
                        onRequestAreaCrop();
                      } else {
                        handleReadScreenAction();
                      }
                    }}
                    disabled={isScanningScreen}
                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-[12px] text-xs font-semibold border transition-all active:scale-[0.98] disabled:opacity-50 ${
                      glassTheme === 'obsidian'
                        ? 'bg-white/10 text-zinc-200 border-white/15 hover:bg-white/15'
                        : 'bg-white text-[#1C1C1E] border-black/8 hover:bg-black/[0.02] shadow-xs'
                    }`}
                    title={language === 'en' ? 'Select custom region on screen' : '自由拖拽框选截屏区域大小'}
                  >
                    <Crop className="w-3 h-3 text-[#007AFF]" strokeWidth={2} />
                    <span>{t.captureArea}</span>
                  </button>
                </div>
              </div>

              {/* Chat Session Utility Bar: Message Counter, Export Notes button, Clear chat button */}
              <div className="mx-4 mb-2 flex items-center justify-between text-[11px] relative z-20">
                <div className={`flex items-center gap-1.5 font-medium px-1 ${
                  glassTheme === 'obsidian' ? 'text-zinc-400' : 'text-[#8E8E93]'
                }`}>
                  <MessageSquareText className="w-3.5 h-3.5 text-[#007AFF]" />
                  <span>{t.messageCount(messages.length)}</span>
                </div>

                <div className="flex items-center gap-1.5 relative" ref={exportMenuRef}>
                  {/* Export Notes Button */}
                  <button
                    onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[10px] border transition-all text-[11px] font-medium active:scale-[0.98] ${
                      glassTheme === 'obsidian'
                        ? 'bg-white/10 hover:bg-white/15 text-zinc-200 border-white/15'
                        : 'bg-white/90 hover:bg-white text-[#1C1C1E] border-black/[0.06] hover:border-black/10 shadow-xs'
                    }`}
                    title={t.exportTitle}
                  >
                    <Download className="w-3 h-3 text-[#007AFF]" strokeWidth={2} />
                    <span>{t.exportNotes}</span>
                    <ChevronDown className={`w-2.5 h-2.5 opacity-60 transition-transform ${isExportMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Clear Chat Button */}
                  <button
                    onClick={handleClearHistory}
                    disabled={messages.length <= 1}
                    className={`p-1.5 rounded-[8px] border transition-all disabled:opacity-30 disabled:pointer-events-none ${
                      glassTheme === 'obsidian'
                        ? 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-red-400 border-white/10'
                        : 'bg-white/60 hover:bg-white text-[#8E8E93] hover:text-red-500 border-black/[0.04]'
                    }`}
                    title={t.clearHistory}
                  >
                    <Trash2 className="w-3 h-3" strokeWidth={1.75} />
                  </button>

                  {/* Export Options Dropdown Popover */}
                  <AnimatePresence>
                    {isExportMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute right-0 top-full mt-1.5 w-60 rounded-[18px] backdrop-blur-2xl border p-1.5 z-50 flex flex-col gap-1 ${
                          glassTheme === 'obsidian'
                            ? 'bg-zinc-950/95 border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.8)] text-zinc-200'
                            : 'bg-white/95 border-black/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.12)] text-[#1C1C1E]'
                        }`}
                      >
                        <div className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                          glassTheme === 'obsidian' ? 'text-zinc-500' : 'text-[#8E8E93]'
                        }`}>
                          {t.exportTitle}
                        </div>

                        <button
                          onClick={() => handleDownloadFile('markdown')}
                          className={`flex items-start gap-2.5 p-2 rounded-[12px] text-left transition-colors group ${
                            glassTheme === 'obsidian' ? 'hover:bg-white/10' : 'hover:bg-[#E5F0FF]/60'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-[8px] bg-[#E5F0FF] text-[#007AFF] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                            <FileDown className="w-3.5 h-3.5" strokeWidth={2} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold">
                              {t.exportMarkdown}
                            </div>
                            <div className={`text-[10px] leading-tight mt-0.5 ${
                              glassTheme === 'obsidian' ? 'text-zinc-400' : 'text-[#8E8E93]'
                            }`}>
                              {t.exportMarkdownDesc}
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => handleDownloadFile('text')}
                          className={`flex items-start gap-2.5 p-2 rounded-[12px] text-left transition-colors group ${
                            glassTheme === 'obsidian' ? 'hover:bg-white/10' : 'hover:bg-[#E5F0FF]/60'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-[8px] bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                            <FileText className="w-3.5 h-3.5" strokeWidth={2} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold">
                              {t.exportText}
                            </div>
                            <div className={`text-[10px] leading-tight mt-0.5 ${
                              glassTheme === 'obsidian' ? 'text-zinc-400' : 'text-[#8E8E93]'
                            }`}>
                              {t.exportTextDesc}
                            </div>
                          </div>
                        </button>

                        <div className={`h-px my-0.5 ${glassTheme === 'obsidian' ? 'bg-white/10' : 'bg-black/[0.06]'}`} />

                        <button
                          onClick={handleCopyAllAsMarkdown}
                          className={`flex items-start gap-2.5 p-2 rounded-[12px] text-left transition-colors group ${
                            glassTheme === 'obsidian' ? 'hover:bg-white/10' : 'hover:bg-[#E5F0FF]/60'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-[8px] bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                            <Copy className="w-3.5 h-3.5" strokeWidth={2} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-[#1C1C1E]">
                              {t.copyAllMarkdown}
                            </div>
                            <div className="text-[10px] text-[#8E8E93] leading-tight mt-0.5">
                              {t.copyAllMarkdownDesc}
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Message History List */}
              <div 
                ref={chatScrollRef}
                onScroll={(e) => {
                  const el = e.currentTarget;
                  const isUp = el.scrollHeight - el.scrollTop - el.clientHeight > 100;
                  setIsScrolledUp(isUp);
                }}
                className="flex-1 overflow-y-auto px-4 py-2 space-y-3 relative"
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[88%] text-xs leading-relaxed backdrop-blur-md ${
                        msg.role === 'user'
                          ? glassTheme === 'obsidian'
                            ? 'bg-cyan-500/20 text-cyan-100 font-medium rounded-[18px] rounded-br-[4px] px-3.5 py-2.5 shadow-[0_2px_15px_rgba(0,240,255,0.2)] border border-cyan-400/30'
                            : 'bg-[#E5F0FF] text-[#1C1C1E] font-medium rounded-[18px] rounded-br-[4px] px-3.5 py-2.5 shadow-sm shadow-[#007AFF]/5 border border-[#007AFF]/15'
                          : glassTheme === 'obsidian'
                          ? 'bg-white/[0.07] text-zinc-100 rounded-[18px] rounded-bl-[4px] px-3.5 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-white/10'
                          : 'bg-white/85 text-[#1C1C1E] rounded-[18px] rounded-bl-[4px] px-3.5 py-2.5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-white/80'
                      }`}
                    >
                      {/* Optional screen badge */}
                      {msg.hasScreenContext && (
                        <div className={`flex items-center gap-1 mb-1.5 text-[10px] font-semibold ${
                          glassTheme === 'obsidian' ? 'text-cyan-300' : 'text-[#007AFF]'
                        }`}>
                          <Paperclip className="w-2.5 h-2.5" strokeWidth={2} />
                          <span>{t.screenContextBadge}</span>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>

                    {/* Speech / Timestamp / Mode footer */}
                    <div className={`flex items-center gap-2 mt-1 px-1.5 text-[10px] ${
                      glassTheme === 'obsidian' ? 'text-zinc-500' : 'text-[#8E8E93]'
                    }`}>
                      <span>{msg.timestamp}</span>
                      {msg.role === 'assistant' && msg.mode && (
                        <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-[6px] border ${
                          glassTheme === 'obsidian'
                            ? 'text-cyan-300 bg-cyan-500/15 border-cyan-500/30'
                            : 'text-[#007AFF] bg-[#E5F0FF] border-[#007AFF]/20'
                        }`}>
                          {msg.mode === 'professional'
                            ? (language === 'en' ? 'Pro' : '专业逻辑')
                            : (language === 'en' ? 'Plain' : '白话通俗')}
                        </span>
                      )}
                      {msg.role === 'assistant' && (
                        <button
                          onClick={() => speakText(msg.text)}
                          className="hover:text-[#007AFF] flex items-center gap-1 transition-colors"
                          title={language === 'en' ? 'Read aloud' : '语音朗读'}
                        >
                          {isSpeaking && activeSpeakingText === msg.text ? (
                            <VolumeX className="w-3 h-3 text-red-500 animate-pulse" strokeWidth={1.75} />
                          ) : (
                            <Volume2 className="w-3 h-3" strokeWidth={1.75} />
                          )}
                          <span>{isSpeaking && activeSpeakingText === msg.text ? t.stopAudio : t.playAudio}</span>
                        </button>
                      )}
                      {/* Copy message button */}
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.text)}
                        className="hover:text-[#007AFF] flex items-center gap-1 transition-colors ml-0.5"
                        title={language === 'en' ? 'Copy text' : '复制内容'}
                      >
                        {copiedMsgId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" strokeWidth={2} />
                            <span className="text-emerald-500">{t.copied}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" strokeWidth={1.75} />
                            <span>{t.copyMessage}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}

                {isLoadingReply && (
                  <div className={`flex items-center gap-2 px-3.5 py-2.5 rounded-[18px] text-xs w-max animate-pulse border ${
                    glassTheme === 'obsidian'
                      ? 'bg-white/10 text-cyan-300 border-cyan-500/30 shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                      : 'bg-white/80 text-[#007AFF] border-white/80 shadow-sm'
                  }`}>
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-[#007AFF]" strokeWidth={1.75} />
                    <span className="font-medium">{t.aiThinking}</span>
                  </div>
                )}
                {isScrolledUp && (
                  <button
                    onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    className={`sticky bottom-2 left-full -translate-x-3 p-1.5 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.2)] border active:scale-95 transition-all z-10 flex items-center justify-center ${
                      glassTheme === 'obsidian'
                        ? 'bg-zinc-800 text-cyan-300 border-white/20 hover:bg-zinc-700'
                        : 'bg-white/95 text-[#007AFF] border-black/5 hover:bg-white'
                    }`}
                    title={language === 'en' ? 'Scroll to bottom' : '回到底部'}
                  >
                    <ArrowDown className="w-3.5 h-3.5" strokeWidth={2} />
                  </button>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Contextual Quick Prompt Chips */}
              <div className="px-4 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {(screenContext ? t.quickPrompts : t.quickPromptsNoScreen).map((promptText, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(promptText)}
                    className={`whitespace-nowrap text-[11px] font-medium px-3 py-1 rounded-[12px] border transition-all active:scale-[0.97] ${
                      glassTheme === 'obsidian'
                        ? 'bg-white/[0.06] text-zinc-300 border-white/10 hover:bg-cyan-500/20 hover:border-cyan-400/40 hover:text-cyan-200'
                        : 'bg-white/70 hover:bg-[#007AFF] hover:text-white text-[#1C1C1E] border-black/[0.04] shadow-xs'
                    }`}
                  >
                    {promptText}
                  </button>
                ))}
              </div>

              {/* Chat Input Area (Framed by futuristic glass pill with subtle optical glow) */}
              <div className="p-4 pt-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className={`flex items-center gap-2 rounded-[22px] p-1.5 pl-4 backdrop-blur-xl border transition-all ${
                    glassTheme === 'obsidian'
                      ? 'bg-white/[0.07] border-white/15 focus-within:border-cyan-400/50 focus-within:ring-2 focus-within:ring-cyan-400/20 shadow-[0_4px_24px_rgba(0,0,0,0.5)]'
                      : 'bg-white/90 border-white/90 shadow-[0_4px_20px_rgba(0,122,255,0.08)] focus-within:ring-2 focus-within:ring-[#007AFF]/20'
                  }`}
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={screenContext ? t.sendPlaceholder : t.sendPlaceholderEmpty}
                    className={`flex-1 text-xs bg-transparent outline-none ${
                      glassTheme === 'obsidian'
                        ? 'text-white placeholder:text-zinc-500'
                        : 'text-[#1C1C1E] placeholder:text-[#8E8E93]'
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoadingReply}
                    className="w-8 h-8 rounded-[14px] bg-[#007AFF] text-white flex items-center justify-center hover:bg-[#0066d6] active:scale-95 disabled:opacity-30 disabled:pointer-events-none shadow-[0_2px_10px_rgba(0,122,255,0.4)] transition-all"
                    title={language === 'en' ? 'Send' : '发送'}
                  >
                    <Send className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
                </form>

                <div className={`text-center mt-1 text-[9px] ${
                  glassTheme === 'obsidian' ? 'text-zinc-500' : 'text-[#8E8E93]'
                }`}>
                  {t.disclaimer}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QUICK DIAGRAM / 快捷框图 */}
          {activeTab === 'diagram' && !isSettingsOpen && (
            <div className="no-drag flex-1 flex flex-col p-3.5 overflow-y-auto min-h-0">
              <QuickDiagramView
                mode={explanationMode}
                language={language}
                isCompact={true}
                activeScreenTitle={screenContext?.title}
                onAskAboutDiagram={(_title, prompt) => {
                  setActiveTab('chat');
                  handleSendMessage(prompt);
                }}
              />
            </div>
          )}

          {/* TAB 3: OBJECTIVE LIVE NEWS */}
          {activeTab === 'news' && !isSettingsOpen && (
            <div className="no-drag flex-1 flex flex-col p-4 overflow-y-auto space-y-3">
              {/* Broadcast Header Pill */}
              <div className={`p-3.5 rounded-[22px] backdrop-blur-xl border flex items-center justify-between transition-all ${
                glassTheme === 'obsidian'
                  ? 'bg-white/[0.06] border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
                  : 'bg-white/80 border-white/80 shadow-sm'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-[12px] flex items-center justify-center ${
                    glassTheme === 'obsidian'
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/30'
                      : 'bg-[#E5F0FF] text-[#007AFF]'
                  }`}>
                    <Radio className="w-4 h-4 animate-pulse" strokeWidth={1.75} />
                  </div>
                  <div>
                    <div className="text-xs font-bold">{t.newsHeader}</div>
                    <div className={`text-[10px] ${glassTheme === 'obsidian' ? 'text-zinc-400' : 'text-[#8E8E93]'}`}>{t.newsSub}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const current = bulletins[currentNewsIndex];
                    if (current) {
                      const titleToSpeak = language === 'en' && current.titleEn ? current.titleEn : current.title;
                      const summaryToSpeak = language === 'en' && current.summaryEn ? current.summaryEn : current.summary;
                      speakText(`${titleToSpeak}. ${summaryToSpeak}`);
                    }
                  }}
                  className="px-3 py-1.5 rounded-[12px] text-xs font-semibold bg-[#007AFF] text-white shadow-sm shadow-[#007AFF]/25 hover:bg-[#0066d6] active:scale-95 transition-all"
                >
                  {isSpeaking ? t.stopAudio : t.playAudio}
                </button>
              </div>

              {/* News Cards */}
              <div className="space-y-2.5">
                {bulletins.map((item, idx) => {
                  const displayType = language === 'en' && item.typeEn ? item.typeEn : item.type;
                  const displayTitle = language === 'en' && item.titleEn ? item.titleEn : item.title;
                  const displaySummary = language === 'en' && item.summaryEn ? item.summaryEn : item.summary;
                  const displaySource = language === 'en' && item.sourceEn ? item.sourceEn : item.source;

                  const isSelected = currentNewsIndex === idx;

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setCurrentNewsIndex(idx);
                        speakText(`${displayTitle}. ${displaySummary}`);
                      }}
                      className={`p-3.5 rounded-[20px] backdrop-blur-md border transition-all cursor-pointer ${
                        isSelected 
                          ? glassTheme === 'obsidian'
                            ? 'bg-cyan-500/15 border-cyan-400/40 shadow-[0_0_20px_rgba(0,240,255,0.15)]'
                            : 'bg-[#E5F0FF] border-[#007AFF]/20 shadow-sm shadow-[#007AFF]/10' 
                          : glassTheme === 'obsidian'
                          ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 shadow-sm'
                          : 'bg-white/70 hover:bg-white/90 border-white/80 shadow-sm'
                      }`}
                    >
                      <div className={`flex items-center justify-between text-[10px] mb-1 ${
                        glassTheme === 'obsidian' ? 'text-zinc-400' : 'text-[#8E8E93]'
                      }`}>
                        <span className={`font-semibold ${glassTheme === 'obsidian' ? 'text-cyan-300' : 'text-[#007AFF]'}`}>{displayType}</span>
                        <span>{item.time}</span>
                      </div>
                      <div className="text-xs font-bold leading-snug mb-1">
                        {displayTitle}
                      </div>
                      <p className={`text-[11px] leading-relaxed ${
                        glassTheme === 'obsidian' ? 'text-zinc-300' : 'text-[#8E8E93]'
                      }`}>
                        {displaySummary}
                      </p>
                      <div className={`mt-2 text-[10px] font-medium opacity-80 ${
                        glassTheme === 'obsidian' ? 'text-zinc-500' : 'text-[#8E8E93]'
                      }`}>
                        {language === 'en' ? 'Source' : '信源'}: {displaySource}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: FINANCIAL DICTIONARY */}
          {activeTab === 'lookup' && !isSettingsOpen && (
            <div className="no-drag flex-1 flex flex-col min-h-0">
              {/* Search Bar (Floating glass style) */}
              <div className="px-4 py-2 shrink-0">
                <div className="relative">
                  <input
                    type="text"
                    value={searchWord}
                    onChange={(e) => setSearchWord(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className={`w-full px-3.5 py-2.5 rounded-[18px] text-xs outline-none shadow-sm pr-9 border transition-all ${
                      glassTheme === 'obsidian'
                        ? 'bg-white/[0.08] text-white border-white/15 placeholder:text-zinc-500 focus:border-cyan-400'
                        : 'bg-white text-[#1C1C1E] placeholder:text-[#8E8E93] border-white focus:border-[#007AFF]'
                    }`}
                  />
                  <div className={`absolute right-3 top-2.5 ${
                    glassTheme === 'obsidian' ? 'text-zinc-400' : 'text-[#8E8E93]'
                  }`}>
                    <Search className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                </div>
              </div>

              {/* Dictionary Cards */}
              <div className="flex-1 overflow-y-auto px-4 py-1 space-y-3">
                {FINANCIAL_DICTIONARY
                  .filter((item: DictionaryItem) => {
                    const q = searchWord.toLowerCase();
                    return (
                      item.term.toLowerCase().includes(q) ||
                      (item.termEn && item.termEn.toLowerCase().includes(q)) ||
                      item.definition.includes(q) ||
                      (item.definitionEn && item.definitionEn.toLowerCase().includes(q))
                    );
                  })
                  .map((item, idx) => {
                    const termTitle = language === 'en' && item.termEn ? item.termEn : item.term;
                    const catTitle = language === 'en' && item.categoryEn ? item.categoryEn : item.category;
                    const defContent = language === 'en' && item.definitionEn ? item.definitionEn : item.definition;

                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-[22px] backdrop-blur-md border transition-all flex flex-col gap-2 ${
                          glassTheme === 'obsidian'
                            ? 'bg-white/[0.05] border-white/10 hover:bg-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
                            : 'bg-white/80 border-white/80 shadow-sm hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold tracking-tight">
                            {termTitle}
                          </h4>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            glassTheme === 'obsidian'
                              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                              : 'bg-[#E5F0FF] text-[#007AFF] border-[#007AFF]/20'
                          }`}>
                            {catTitle}
                          </span>
                        </div>

                        <p className={`text-[11px] leading-relaxed ${
                          glassTheme === 'obsidian' ? 'text-zinc-300' : 'text-[#1C1C1E] opacity-90'
                        }`}>
                          {defContent}
                        </p>

                        {item.formula && (
                          <div className={`mt-1 p-2 rounded-[12px] font-mono text-[10px] break-words border ${
                            glassTheme === 'obsidian'
                              ? 'bg-black/40 text-cyan-300 border-cyan-500/20'
                              : 'bg-black/[0.03] text-[#007AFF] border-black/5'
                          }`}>
                            {item.formula}
                          </div>
                        )}

                        <div className="mt-2 pt-2 flex items-center justify-end">
                          <button
                            onClick={() => {
                              onSearchTerm(item.term);
                              setActiveTab('chat');
                              const askPrompt = language === 'en'
                                ? `Please deconstruct in plain language: ${item.termEn || item.term}`
                                : `请用通俗大白话拆解：${item.term}`;
                              handleSendMessage(askPrompt);
                            }}
                            className="text-[11px] font-semibold text-[#007AFF] hover:text-[#005bb5] flex items-center gap-1 transition-colors"
                          >
                            <Sparkles className="w-3.5 h-3.5" strokeWidth={1.75} />
                            <span>{t.aiDeconstruct}</span>
                            <ChevronRight className="w-3 h-3" strokeWidth={2} />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                {FINANCIAL_DICTIONARY.filter((item: DictionaryItem) => {
                  const q = searchWord.toLowerCase();
                  return (
                    item.term.toLowerCase().includes(q) ||
                    (item.termEn && item.termEn.toLowerCase().includes(q)) ||
                    item.definition.includes(q) ||
                    (item.definitionEn && item.definitionEn.toLowerCase().includes(q))
                  );
                }).length === 0 && (
                  <div className={`text-center py-12 text-xs ${
                    glassTheme === 'obsidian' ? 'text-zinc-500' : 'text-[#8E8E93]'
                  }`}>
                    {t.noTermsFound}
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};
